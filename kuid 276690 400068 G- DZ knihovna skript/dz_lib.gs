/// ============================================
/// @file   dz_lib.gs
/// @author Vojtech Cimbura
/// ============================================


include "Library.gs"


/// @brief Helper class (Road Sign Utils)
static final class RSUtils
{
	// HTML property tags, also can be used for Trainz database save & load operations on the object
	define public int TAG_SignSelection 	 	= 100;
	define public int TAG_SignPole 		 	 	= 101; // Used by 'DZBase::Customization' variable
	define public int TAG_InputEntry 		 	= 102;
	define public int TAG_SignAdditionalData 	= 103;
	define public int TAG_SignBase			 	= 104;
	define public int TAG_AssociatedSignID 		= 105;
	define public int TAG_DelAssociatedSignID 	= 106;
	define public int TAG_NumAssociatedSignIDs 	= 107;
	define public int TAG_AlignAssociatedSigns 	= 108;

	define public int INPUT_None 		= 1 << 0; // SignData::SignFlags - AdditionalData not specified
	define public int INPUT_Int			= 1 << 1; // SignData::SignFlags - AdditionalData storing an integer
	define public int INPUT_Float 		= 1 << 2; // SignData::SignFlags - AdditionalData storing a float
	define public int INPUT_String		= 1 << 3; // SignData::SignFlags - AdditionalData storing a string
	define public int INPUT_Pole230cm 	= 1 << 4; // SignData::SignFlags - sign must have 230cm pole only
	define public int INPUT_LowerClip 	= 1 << 5; // SignData::SignFlags - sign must have the sign clip located lower than usually
	define public int INPUT_NoPole 		= 1 << 6; // SignData::SignFlags - sign does not support pole selection and must be attached
	define public int INPUT_OptionCycle	= 1 << 7; // SignData::SignFlags - sign supports cycling through presets

	define public int INPUT_AdditionalInputFlags = INPUT_None | INPUT_Int | INPUT_Float | INPUT_String;

	// DZBase::Customization uses those to specify the current sign visuals
	define public int CUST_Pole_None  = 1 << 0;
	define public int CUST_Pole_100cm = 1 << 1;
	define public int CUST_Pole_200cm = 1 << 2;
	define public int CUST_Pole_300cm = 1 << 3;
	define public int CUST_Pole_230cm = 1 << 4;
	define public int CUST_Base 	  = 1 << 15;

	define public int CUST_PoleValuesAll = CUST_Pole_None | CUST_Pole_100cm | CUST_Pole_200cm | CUST_Pole_300cm | CUST_Pole_230cm;
	define public int CUST_DefaultValues = CUST_Pole_300cm | CUST_Base;

	// config.txt mesh tags
	define public string CFG_Base = "zaklad";
	define public string CFG_Pole = "sloup";
	define public string CFG_Clip = "svorka";
	define public string CFG_Sign = "znacka";

	// Some HTML strings
	define public string TEXT_CUST_Pole_None	= "Žádný";
	define public string TEXT_CUST_Pole_100cm 	= "1 metr";
	define public string TEXT_CUST_Pole_200cm 	= "2 metry";
	define public string TEXT_CUST_Pole_300cm 	= "3 metry";
	define public string TEXT_CUST_Pole_230cm 	= "2.3 metru";
	define public string TEXT_BaseHTML 			= "Základ";
	define public string TEXT_PoleHTML 			= "Sloup";
	define public string TEXT_ExtraDataHTML 	= "Data navíc";
	define public string TEXT_NoBaseHTML 		= "Nelze vybrat";
	define public string TEXT_TitleHTML 		= "DOPRAVNÍ ZNAČKY";
	define public string TEXT_ChooseHTML 		= "Vyber";
	define public string TEXT_EnterHTML 		= "Zadej";


	// ============================================
	// Function definitions
	// ============================================

	/// @brief Checks existence of given GameObjectID
	/// @param ObjectID ID to test
	/// @return True if the GameObjectID is valid and the object does exist within the world, False otherwise
	public bool IsValid(GameObjectID ObjectID)
	{
		return ObjectID != null and Router.GetGameObject(ObjectID);
	}

	/// @brief Creates human readable name from the given object ID
	/// @param ObjectID GameObjectID to process
	/// @return Name of the game object
	public string GetObjectName(GameObjectID ObjectID)
	{
		if (ObjectID)
		{
			string GameObjectString = ObjectID.SerialiseToString();
			string[] Parser = Str.Tokens(GameObjectString, ",");
			return Parser[Parser.size() - 1]; // object name is the last one
		}
		return "Nezadáno";
	}

	/// @brief Rounds given float value down to the largest possible integer
	/// @param Value Number to convert
	/// @return Converted integer value casted to float
	public float floor(float Value)
	{
		int Tmp = (int) Value;
		return (float) Tmp;
	}

	/// @brief Formats given float into a string for HTML in a way it does not contain the dot if not neccessary
	/// @param Value Number to format into a string
	/// @return Formatted string containing the given number
	public string FormatFloatInput(float Value)
	{
		string FormattedString = (string) Value;

		if (Value == floor(Value))
		{
			// Input value does not have a decimal point, format as 'x' (single digit)
			Str.Left(FormattedString, 1);
		}
		else
		{
			// Float number - cut to just three characters, so the format will be 'x.y'
			Str.Left(FormattedString, 3);
		}
		
		return FormattedString;
	}

	/// @brief Formats given integer into a string for HTML, clamps it's range to [0,150]
	/// @param Value Number to format into a string
	/// @param MinValue Lower bound for Value
	/// @param MaxValue Upper bound for Value
	/// @return Formatted string containing the given number
	public string FormatIntInput(int Value, int MinValue, int MaxValue)
	{
		// Clamp into allowed range
		Value = Math.Max(Value, MinValue);
		Value = Math.Min(Value, MaxValue);
		
		return (string) Value;
	}

	/// @brief Determines if the sign pole mesh is shown or not
	/// @param Customization Current sign configuration, used to extract the sign pole type
	/// @return True if the sign mesh is visible, False otherwise
	public bool IsSignPoleVisible(int Customization)
	{
		int PoleBitsExceptNone = RSUtils.CUST_PoleValuesAll & ~RSUtils.CUST_Pole_None;
		bool bIsPoleSelected = Customization & PoleBitsExceptNone;
		return bIsPoleSelected;
	}

	/// @brief Converts HTML string text of sign pole type to flag representation
	/// @param PoleHtmlText HTML string to convert
	/// @return Flag representation of the sign pole
	public int GetSignPoleFlagFromHtmlText(string PoleHtmlText)
	{
		int SignPoleFlag = 0;
		if 		(PoleHtmlText == TEXT_CUST_Pole_None)  SignPoleFlag = CUST_Pole_None;
		else if (PoleHtmlText == TEXT_CUST_Pole_100cm) SignPoleFlag = CUST_Pole_100cm;
		else if (PoleHtmlText == TEXT_CUST_Pole_200cm) SignPoleFlag = CUST_Pole_200cm;
		else if (PoleHtmlText == TEXT_CUST_Pole_300cm) SignPoleFlag = CUST_Pole_300cm;
		else if (PoleHtmlText == TEXT_CUST_Pole_230cm) SignPoleFlag = CUST_Pole_230cm;

		return SignPoleFlag;
	}

	/// @brief Construct HTML text from the sign pole flag representation
	/// @param CustomizationFlags Current sign configuration, used to extract the sign pole type
	/// @return HTML text representing the currently used sign pole
	public string GetCurrentSignPoleHtmlText(int CustomizationFlags)
	{
		string PoleHtmlText = "ERROR";
		switch(CustomizationFlags & RSUtils.CUST_PoleValuesAll)
		{
			case RSUtils.CUST_Pole_None:
				PoleHtmlText = TEXT_CUST_Pole_None;
				break;
			case RSUtils.CUST_Pole_100cm:
				PoleHtmlText = TEXT_CUST_Pole_100cm;
				break;
			case RSUtils.CUST_Pole_200cm:
				PoleHtmlText = TEXT_CUST_Pole_200cm;
				break;
			case RSUtils.CUST_Pole_300cm:
				PoleHtmlText = TEXT_CUST_Pole_300cm;
				break;
			case RSUtils.CUST_Pole_230cm:
				PoleHtmlText = TEXT_CUST_Pole_230cm;
				break;
			default:
				break;
		}
		return PoleHtmlText;
	}

	/// @brief Constructs sign pole or sign clip config tag to be used in scripts
	/// @param CfgTag Specification of the config mesh entry to use
	/// @param CustomizationFlags Current sign configuration, used to extract the sign pole type
	/// @return String representation of the config tag
	public string GetSignPoleOrClipConfigTag(string CfgTag, int CustomizationFlags)
	{
		switch(CustomizationFlags & CUST_PoleValuesAll)
		{
			case RSUtils.CUST_Pole_100cm:
				CfgTag = CfgTag +"01";
				break;
			case RSUtils.CUST_Pole_200cm:
				CfgTag = CfgTag +"02";
				break;
			case RSUtils.CUST_Pole_300cm:
				CfgTag = CfgTag +"03";
				break;
			case RSUtils.CUST_Pole_230cm:
				CfgTag = CfgTag +"04";
				break;
			default:
				CfgTag = null;
				break;
		}
		return CfgTag;
	}

	/// @brief Constructs sign config tag to be used in scripts
	/// @param Index Specification of which sign mesh to reference
	/// @return String representation of the config tag
	public string GetSignConfigTag(int Index)
	{
		// Tags start from 01, but code starts indexing from 0
		// -> add 1 to get correct CFG tag
		Index = Index + 1;

		string CfgTag = CFG_Sign;
		if (Index < 10)
		{
			// Config tags have a form 'znackaXY', where 'X' can be 0
			// so we need to add extra '0' in this case
			CfgTag = CfgTag + "0";
		}

		return CfgTag + Index;
	}

	/// @brief Determines relative height offset of the sign mesh
	/// @param CustomizationFlags Current sign configuration, used to extract the sign pole type
	/// @return Relative height offset for given sign configuration
	public float GetSignHeightFromPole(int CustomizationFlags)
	{
		float Height = 0.0;
		int PoleHeight = CustomizationFlags & RSUtils.CUST_PoleValuesAll;
		switch(PoleHeight)
		{
			case RSUtils.CUST_Pole_None:
				break;
			case RSUtils.CUST_Pole_100cm:
				Height = -2.0;
				break;
			case RSUtils.CUST_Pole_200cm:
				Height = -1.0;
				break;
			case RSUtils.CUST_Pole_300cm:
				Height = 0.0; // Default mesh exported height
				break;
			case RSUtils.CUST_Pole_230cm:
				Height = 0.0; // Default mesh exported height
				break;
			default:
				Interface.Print("ERROR: " + PoleHeight);
				break;
		}
		return Height;
	}

	/// @brief Constructs HTML image tag
	/// @param w Desired image width
	/// @param h Desired image height
	/// @param src Relative path to the image
	/// @return HTML image in a string
	public string Img(int w, int h, string src)
	{
		return "<img width=" + w + " height=" + h + " src=\"" + src + "\"></img>";
	}

	/// @brief Constructs HTML radio button
	/// @param Property PropertyID of the HTML element
	/// @param Value if the radio button is ticked or not
	/// @return HTML radio button in a string
	public string RadioButton(string Property, bool Value)
	{
		return HTMLWindow.RadioButton("live://property/" + Property, Value);
	}

	/// @brief Constructs HTML checkbox
	/// @param Property PropertyID of the HTML element
	/// @param Value if the checkbox is ticked or not
	/// @return HTML checkbox in a string
	public string Checkbox(int Property, bool Value)
	{
		return HTMLWindow.CheckBox("live://property/" + (string)Property, Value);
	}

	/// @brief Constructs HTML link on a HTML text
	/// @param Property PropertyID of the HTML element
	/// @param Tooltip Text to show on link hover
	/// @param Text Text to wrap as a HTML link
	/// @return HTML link in a string
	public string InputField(string Property, string Tooltip, string Text)
	{
		return "<td align=left valign=center><font size=2 face=Consolas color=#ffffff><a tooltip=\""+Tooltip+"\" href=live://property/"+Property+">"+Text+"</a></font></td>";
	}

	/// @brief Constructs HTML table cell
	/// @param Text Text to show in the cell
	/// @param ImagePath Relative path to a HTML image to use in the cell
	/// @param SignSelectionIdx Number corresponding to the currently selected sign
	/// @param Idx Identifier of the current HTML cell
	/// @return HTML table cell in a string
	public string Td(string Text, string ImagePath, int SignSelectionIdx, int Idx)
	{
		string FontColor = "#ffffff";
		
		// Highlighted signs will get highlighted text
		if (ImagePath and Str.Find(ImagePath, "z", ImagePath.size() - 5) > 0) // Why 'ImagePath.size() - 5'? last letter in image filename, e.g. 'sign1z.png'
		{
			FontColor = "#F4E601";
		}

		return
			"<td width=1% valign=center align=center>" + RadioButton(TAG_SignSelection + "/" + Idx, SignSelectionIdx == Idx) + "</td>"+
			"<td width=1% valign=center align=center>" + Img(50, 50, ImagePath) + "</td>"+
			"<td valign=center width=31%><font size=1 face=Consolas color=" + FontColor + ">" + Text + "</font></td>";
	}
};

/// {brief Road sign library, currently unused}
class dzlib isclass Library
{

};