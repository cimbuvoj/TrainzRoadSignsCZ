/// ============================================
/// @file   dz_lib.gs
/// @author Vojtech Cimbura, 2025
/// ============================================


include "Library.gs"


/// @brief Helper class (Road Sign Utils)
static final class RSUtils
{
	define public int TAG_SignSelection 	 = 100;
	define public int TAG_SignPole 		 	 = 101; // Used by 'Customization' variable
	define public int TAG_InputEntry 		 = 102;
	define public int TAG_SignAdditionalData = 103;
	define public int TAG_SignBase			 = 104;

	define public int INPUT_None 	= 1 << 0;
	define public int INPUT_Int		= 1 << 1;
	define public int INPUT_Float 	= 1 << 2;
	define public int INPUT_Sign	= 1 << 3;
	define public int INPUT_Pole230cm = 1 << 4;
	define public int INPUT_LowerClip = 1 << 5;

	define public int INPUT_AdditionalInputFlags = INPUT_None | INPUT_Int | INPUT_Float | INPUT_Sign;

	define public int Pole_None 	= 1 << 0;
	define public int Pole_100cm 	= 1 << 1;
	define public int Pole_200cm 	= 1 << 2;
	define public int Pole_300cm 	= 1 << 3;
	define public int Pole_230cm 	= 1 << 4;

	define public int BaseEnable_Bit 	= 1 << 15;

	define public int Default_PoleValuesAll = Pole_None | Pole_100cm | Pole_200cm | Pole_300cm | Pole_230cm;
	define public int Default_Customization = Pole_300cm | BaseEnable_Bit;

	define public string CFG_Base = "zaklad";
	define public string CFG_Pole = "sloup";
	define public string CFG_Clip = "svorka";
	define public string CFG_Sign = "znacka";

	// HTML strings (You can localize without using the stringtable provided by Trainz)
	define public string TEXT_Pole_None		= "Žádný";
	define public string TEXT_Pole_100cm 	= "1 metr";
	define public string TEXT_Pole_200cm 	= "2 metry";
	define public string TEXT_Pole_300cm 	= "3 metry";
	define public string TEXT_Pole_230cm 	= "2.3 metru";
	define public string TEXT_BaseHTML 		= "Základ";
	define public string TEXT_PoleHTML 		= "Sloup";
	define public string TEXT_ExtraDataHTML = "Data navíc";
	define public string TEXT_NoBaseHTML 	= "Nelze vybrat";
	define public string TEXT_TitleHTML 	= "DOPRAVNÍ ZNAČKY";
	define public string TEXT_ChooseHTML 	= "Vyber";
	define public string TEXT_EnterHTML 	= "Zadej";


	// ============================================
	// Functions
	// ============================================
	public float floor(float InValue)
	{
		int Tmp = (int) InValue;
		return (float) Tmp;
	}

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

	public string FormatIntInput(int Value)
	{
		// Clamp into allowed range
		Value = Math.Max(Value, 0);
		Value = Math.Min(Value, 150);
		
		return (string) Value;
	}

	public bool IsSignPoleVisible(int Customization)
	{
		int PoleBitsExceptNone = RSUtils.Default_PoleValuesAll & ~RSUtils.Pole_None;
		bool bIsPoleSelected = Customization & PoleBitsExceptNone;
		return bIsPoleSelected;
	}

	public int GetSignPoleFlagFromHtmlText(string PoleHtmlText)
	{
		int SignPoleFlag = 0;
		if 		(PoleHtmlText == TEXT_Pole_None)  SignPoleFlag = Pole_None;
		else if (PoleHtmlText == TEXT_Pole_100cm) SignPoleFlag = Pole_100cm;
		else if (PoleHtmlText == TEXT_Pole_200cm) SignPoleFlag = Pole_200cm;
		else if (PoleHtmlText == TEXT_Pole_300cm) SignPoleFlag = Pole_300cm;
		else if (PoleHtmlText == TEXT_Pole_230cm) SignPoleFlag = Pole_230cm;

		return SignPoleFlag;
	}

	public string GetCurrentSignPoleHtmlText(int CustomizationFlags)
	{
		string PoleHtmlText = "ERROR";
		switch(CustomizationFlags & RSUtils.Default_PoleValuesAll)
		{
			case RSUtils.Pole_None:
				PoleHtmlText = TEXT_Pole_None;
				break;
			case RSUtils.Pole_100cm:
				PoleHtmlText = TEXT_Pole_100cm;
				break;
			case RSUtils.Pole_200cm:
				PoleHtmlText = TEXT_Pole_200cm;
				break;
			case RSUtils.Pole_300cm:
				PoleHtmlText = TEXT_Pole_300cm;
				break;
			case RSUtils.Pole_230cm:
				PoleHtmlText = TEXT_Pole_230cm;
				break;
			default:
				break;
		}
		return PoleHtmlText;
	}

	public string GetSignPoleOrClipConfigTag(string CfgTag, int CustomizationFlags)
	{
		switch(CustomizationFlags & Default_PoleValuesAll)
		{
			case RSUtils.Pole_100cm:
				CfgTag = CfgTag +"01";
				break;
			case RSUtils.Pole_200cm:
				CfgTag = CfgTag +"02";
				break;
			case RSUtils.Pole_300cm:
				CfgTag = CfgTag +"03";
				break;
			case RSUtils.Pole_230cm:
				CfgTag = CfgTag +"04";
				break;
			default:
				CfgTag = null;
				break;
		}
		return CfgTag;
	}

	public string GetSignConfigTag(int Index)
	{
		// Tags start from 01, but code starts from 00
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

	public float GetSignHeightFromPole(int CustomizationFlags)
	{
		float Height = 0.0;
		switch(CustomizationFlags & RSUtils.Default_PoleValuesAll)
		{
			case RSUtils.Pole_None:
				break;
			case RSUtils.Pole_100cm:
				Height = -2.0;
				break;
			case RSUtils.Pole_200cm:
				Height = -1.0;
				break;
			case RSUtils.Pole_300cm:
				Height = 0.0; // Default mesh exported height
				break;
			case RSUtils.Pole_230cm:
				Height = 0.0; // Default mesh exported height
				break;
			default:
				break;
		}
		return Height;
	}

	public string Img(int w, int h, string src)
	{
		return "<img width=" + w + " height=" + h + " src=\"" + src + "\"></img>";
	}

	public string RadioButton(string Property, bool Value)
	{
		return HTMLWindow.RadioButton("live://property/" + Property, Value);
	}

	public string Checkbox(int Property, bool Value)
	{
		return HTMLWindow.CheckBox("live://property/" + (string)Property, Value);
	}

	public string InputField(string Property, string Tooltip, string Text)
	{
		return "<td align=left valign=center><font size=2 face=Consolas color=#ffffff><a tooltip=\""+Tooltip+"\" href=live://property/"+Property+">"+Text+"</a></font></td>";
	}

	public string Td(string Text, string ImagePath, int SignSelectionIdx, int Idx)
	{
		string FontColor = "#ffffff";
		
		// Highlighted signs will get highlighted text
		if (ImagePath and Str.Find(ImagePath, "z", ImagePath.size() - 5) > 0)
		{
			FontColor = "#F4E601";
		}

		return
			"<td width=1% valign=center align=center>" + RadioButton(TAG_SignSelection + "/" + Idx, SignSelectionIdx == Idx) + "</td>"+
			"<td width=1% valign=center align=center>" + Img(50, 50, ImagePath) + "</td>"+
			"<td valign=center width=31%><font size=1 face=Consolas color=" + FontColor + ">" + Text + "</font></td>";
	}
};

class dzlib isclass Library
{

};