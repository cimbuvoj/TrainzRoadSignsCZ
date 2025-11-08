// =================================
// dz_base.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "MapObject.gs"

// Road Sign Utils
static final class RSUtils
{
	define public int TAG_SignSelection 	 = 100;
	define public int TAG_SignPole 		 	 = 101;
	define public int TAG_InputEntry 		 = 102;
	define public int TAG_SignAdditionalData = 103;
	define public int TAG_SignBase			 = 104;

	define public string CFG_Base = "zaklad";
	define public string CFG_Pole = "sloup";
	define public string CFG_Clip = "svorka";
	define public string CFG_Sign = "znacka";

	define public int INPUT_None 	= 0;
	define public int INPUT_Int		= 1;
	define public int INPUT_Float 	= 2;
	define public int INPUT_Sign	= 3;

	define public int Pole_None 	= 1 << 0;
	define public int Pole_100cm 	= 1 << 1;
	define public int Pole_200cm 	= 1 << 2;
	define public int Pole_300cm 	= 1 << 3;
	define public int Pole_230cm 	= 1 << 4;

	define public int BaseEnable_Bit 	= 1 << 15;

	define public int Default_PoleValuesAll = Pole_None | Pole_100cm | Pole_200cm | Pole_300cm| Pole_230cm;
	define public int Default_Customization = Pole_300cm | BaseEnable_Bit;

	// ======================
	// Functions
	// ======================
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

	public int GetSignPoleFlagFromHtmlText(string PoleHtmlText)
	{
		int SignPoleFlag = 0;
		if (PoleHtmlText == "Žádný") SignPoleFlag = Pole_None;
		else if (PoleHtmlText == "1 metr") SignPoleFlag = Pole_100cm;
		else if (PoleHtmlText == "2 metry") SignPoleFlag = Pole_200cm;
		else if (PoleHtmlText == "3 metry") SignPoleFlag = Pole_300cm;
		else if (PoleHtmlText == "2.3 metru") SignPoleFlag = Pole_230cm;

		return SignPoleFlag;
	}

	public string GetCurrentSignPoleHtmlText(int CustomizationFlags)
	{
		string PoleHtmlText = "ERROR";
		switch(CustomizationFlags & RSUtils.Default_PoleValuesAll)
		{
			case RSUtils.Pole_None:
				PoleHtmlText = "Žádný";
				break;
			case RSUtils.Pole_100cm:
				PoleHtmlText = "1 metr";
				break;
			case RSUtils.Pole_200cm:
				PoleHtmlText = "2 metry";
				break;
			case RSUtils.Pole_300cm:
				PoleHtmlText = "3 metry";
				break;
			case RSUtils.Pole_230cm:
				PoleHtmlText = "2.3 metry";
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
		// Tags start from 01, but code starts from 0
		// add 1 to get correct CFG tag
		Index = Index + 1;

		string CfgTag = CFG_Sign;
		if (Index < 10)
		{
			// Config tags have form 'znackaXY', where 'X' can be 0
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
				Height = 0.0;
				break;
			case RSUtils.Pole_230cm:
				Height = -0.7;
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
		if (Str.Find(ImagePath, "z", ImagePath.size() - 5) > 0)
		{
			FontColor = "#F4E601";
		}

		return
			"<td width=1% valign=center align=center>" + RadioButton(TAG_SignSelection + "/" + Idx, SignSelectionIdx == Idx) + "</td>"+
			"<td width=1% valign=center align=center>" + Img(50, 50, ImagePath) + "</td>"+
			"<td valign=center width=31%><font size=1 face=Consolas color=" + FontColor + ">" + Text + "</font></td>";
	}
};

// Configuration of each sign type
class SignData
{
	public string Name;
	public string ImagePath;
	public int InputType = RSUtils.INPUT_None;
	public float AdditionalData = 0.0;
	public bool bPole230cmOnly = false;

	public void SetData(string InName, string InImagePath, int InInputType, float InAdditionalData, bool bInPole230cmOnly)
	{
		Name = InName;
		ImagePath = InImagePath;
		InputType = InInputType;
		AdditionalData = InAdditionalData;
		bPole230cmOnly = bInPole230cmOnly;
	}

	public void SetData(string InName, string InImagePath, int InInputType, float InAdditionalData)
	{
		SetData(InName, InImagePath, InInputType, InAdditionalData, false);
	}

	public void SetData(string InName, string InImagePath, bool bInPole230cmOnly)
	{
		SetData(InName, InImagePath, RSUtils.INPUT_None, 0.0, bInPole230cmOnly);
	}

	public void SetData(string InName, string InImagePath)
	{
		SetData(InName, InImagePath, RSUtils.INPUT_None, 0.0, false);
	}
};

// Base class for all sign, inherit from it to add other types and add entires in Init()
class DZBase isclass MapObject
{
	// Array of entries for HTML, user defines a new entry and everything else is handled internally
	public SignData[] SignEntries;

	// Index of sign mesh that should be visible
	int SignSelection = 0;

	// Flag field, currently used bits: 1-5 pole types, 16 sign base, rest free to use 
	int Customization = RSUtils.Default_Customization;

	// Additional data, such as speed or other values
	string AdditionalSignData = null;

	// ======================
	// Functions
	// ======================
	void Init()
	{
		inherited();

		SignEntries = new SignData[0];
	}

	// Adds a new element into SignEntries and returns the index on which the new array element resides
	public int EmplaceEntry()
	{
		int Index = SignEntries.size();
		SignEntries[Index] = new SignData();
		return Index;
	}

	// When this object is loaded, we need to reset all visible meshes and show the ones we should show
	void ResetMeshes()
	{
		// Sign base
		SetMeshVisible(RSUtils.CFG_Base, (bool) (Customization & RSUtils.BaseEnable_Bit), 0.0);

		// Sign pole + clip
		SetMeshVisible(RSUtils.CFG_Pole + "01", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Pole + "02", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Pole + "03", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Pole + "04", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Clip + "01", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Clip + "02", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Clip + "03", false, 0.0);
		SetMeshVisible(RSUtils.CFG_Clip + "04", false, 0.0);

		string CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (CfgTag != null)
		{
			SetMeshVisible(CfgTag, (bool) (Customization & RSUtils.Default_PoleValuesAll), 0.0);
		}

		CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
		if (CfgTag != null)
		{
			SetMeshVisible(CfgTag, (bool) (Customization & RSUtils.Default_PoleValuesAll), 0.0);
		}

		// Sign type
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			string MeshName = RSUtils.GetSignConfigTag(i);
			SetMeshVisible(MeshName, i == SignSelection, 0.0);
			SetMeshTranslation(MeshName, 0.0, 0.0, RSUtils.GetSignHeightFromPole(Customization));
		}
	}

	// Sets the customization bit for sign pole to defined value and updates meshes accordingly
	void UpdateSignPoleMesh(int NewPoleBit)
	{
		// Reset previous mesh if it is a valid mesh name
		string CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (CfgTag != null)
		{
			//Hhide pole mesh
			SetMeshVisible(CfgTag, false, 0.0); 

			// Hide clip mesh
			CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
			SetMeshVisible(CfgTag, false, 0.0); 
		}

		// Clear pole bits
		Customization = Customization & ~RSUtils.Default_PoleValuesAll;

		// Assign new pole type
		Customization = Customization | (Customization & RSUtils.Default_PoleValuesAll) | NewPoleBit;

		// Make the new mesh visible if it is a valid mesh name
		CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (CfgTag != null)
		{
			// Show pole mesh
			SetMeshVisible(CfgTag, true, 0.0); 

			// Show clip mesh
			CfgTag = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
			SetMeshVisible(CfgTag, true, 0.0); 
		}
	}
	
	// ======================
	// Save and Load
	// ======================
	// Load
	public void SetProperties(Soup Properties)
	{
		inherited(Properties);

		SignSelection 		= Properties.GetNamedTagAsInt(RSUtils.TAG_SignSelection, 0);
		Customization		= Properties.GetNamedTagAsInt(RSUtils.TAG_SignPole, RSUtils.Pole_300cm | RSUtils.BaseEnable_Bit); // SignPole is a free saving tag
		AdditionalSignData 	= Properties.GetNamedTag(RSUtils.TAG_SignAdditionalData);

		ResetMeshes();
	}

	// Save
	public Soup GetProperties()
	{
		Soup Properties = inherited();

		Properties.SetNamedTag(RSUtils.TAG_SignSelection, SignSelection);
		Properties.SetNamedTag(RSUtils.TAG_SignPole, Customization);  // SignPole is a free saving tag
		Properties.SetNamedTag(RSUtils.TAG_SignAdditionalData, AdditionalSignData);

		return Properties;
	}

	// ======================
	// HTML
	// ======================
	public string CreateHTML(string Title)
	{
		// HTML window base
		string html = "<html><body>"+
			"<table width=100% bgcolor=#333333>"+
				"<tr>"+
					"<td bgcolor=#EECFA1 colspan=6 align=center><font size=5 face=Consolas color=#000000><b>DOPRAVNÍ ZNAČKY - " + Title + "</b></font></td>"+
				"</tr>";

		// Sign - Base
		{
			bool bShowBase = Customization & RSUtils.BaseEnable_Bit;

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> Základ " + RSUtils.Checkbox(RSUtils.TAG_SignBase, bShowBase) +"</font></td>"+
				"</tr>";
		}

		// Sign - Pole and Clip
		{
			string PoleHtmlText = RSUtils.GetCurrentSignPoleHtmlText(Customization);
			int Value = Customization & RSUtils.Default_PoleValuesAll;

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> Sloup " + RSUtils.InputField(RSUtils.TAG_SignPole + "/" + Value, "Zadej", PoleHtmlText) +"</font></td>"+
				"</tr>";
		}

		// Sign - Additional data
		if (SignEntries[SignSelection].InputType != RSUtils.INPUT_None)
		{
			// This road sign requires additional input data
			if (AdditionalSignData == null)
			{
				// Default value
				switch (SignEntries[SignSelection].InputType)
				{
					case RSUtils.INPUT_Int:
						AdditionalSignData = RSUtils.FormatIntInput((int) SignEntries[SignSelection].AdditionalData);
						break;
					case RSUtils.INPUT_Float:
						AdditionalSignData = RSUtils.FormatFloatInput(SignEntries[SignSelection].AdditionalData);
						break;
					case RSUtils.INPUT_Sign:
						AdditionalSignData = ""; // TODO
						break;
					default:
						break;
				}
			}

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> Data navíc " + RSUtils.InputField(RSUtils.TAG_InputEntry + "/" + SignSelection, "Zadej", AdditionalSignData) +"</font></td>"+
				"</tr>";
		}

		// Print sign matrix
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			// Even index = start row, odd index = end row
			bool bAddStartRow = (i % 2) == 0;
			if (bAddStartRow)
			{
				html = html + "<tr height=50>";
			}
			html = html + RSUtils.Td(SignEntries[i].Name, SignEntries[i].ImagePath, SignSelection, i);
			if (!bAddStartRow)
			{
				html = html + "</tr>";
			}
		}

		// Odd number of elements = end last row
		bool bAddLastEmpty = (SignEntries.size() % 2) == 1;
		if (bAddLastEmpty)
		{
			html = html + "</tr>";
		}

		return html + "</table></body></html>";
	}

	public void LinkPropertyValue(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);
		
		switch(nID)
		{
			case RSUtils.TAG_SignSelection:
			{
				bool bOld230cmPoleOption = SignEntries[SignSelection].bPole230cmOnly;
				SetMeshVisible(RSUtils.GetSignConfigTag(SignSelection), false, 0.0);

				SignSelection = Str.ToInt(TagParser[1]);

				string NewSignMesh = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshVisible(NewSignMesh, true, 0.0);
				bool bNew230cmPoleOption = SignEntries[SignSelection].bPole230cmOnly;
				AdditionalSignData = "";

				// Pole types without 'no pole' option - Mask for clearing up pole selection bits
				int PoleBitsExceptNone = RSUtils.Default_PoleValuesAll & ~RSUtils.Pole_None;
				bool bIsPoleSelected = Customization & PoleBitsExceptNone;
				if (bIsPoleSelected)
				{
					// Switching from default pole type to special pole type?
					if (!bOld230cmPoleOption and bNew230cmPoleOption)
					{
						UpdateSignPoleMesh(RSUtils.Pole_230cm);
					}
					// Switching from special pole type to default type?
					else if (bOld230cmPoleOption and !bNew230cmPoleOption)
					{
						UpdateSignPoleMesh(RSUtils.Pole_300cm);
					}
				}

				SetMeshTranslation(NewSignMesh, 0.0, 0.0, RSUtils.GetSignHeightFromPole(Customization));
				
				break;
			}
			case RSUtils.TAG_SignBase:
			{
				// Flip the sign base bit
				Customization = Customization ^ RSUtils.BaseEnable_Bit;
				SetMeshVisible(RSUtils.CFG_Base, (bool) (Customization & RSUtils.BaseEnable_Bit), 0.0);
				break;
			}
			default:
				break;
		}
	}

	// Sets the input dialog window title
	public string GetPropertyName(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
				return "Zadej";
			case RSUtils.TAG_SignPole:
				return "Vyber";
			default:
				break;
		}

		return inherited(PropertyID);
	}

	// Adds the current value to the input dialog
	public string GetPropertyValue(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
				return AdditionalSignData;
			case RSUtils.TAG_SignPole:
				return RSUtils.GetCurrentSignPoleHtmlText(Customization);
			default:
				break;
		}
		return inherited(PropertyID);
	}

	// Determines data type for the input dialog
	public string GetPropertyType(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);
		
		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
			{
				int CurrentSignSelection = Str.ToInt(TagParser[1]);
				switch (SignEntries[CurrentSignSelection].InputType)
				{
					case RSUtils.INPUT_Int:
						// Any integer, speed can be up to 150 now
						return "int,0,150,1";
					case RSUtils.INPUT_Float:
						// Usually for width of vehicles, 9.9 is enough
						return "float,0,9.9,0.1";
					case RSUtils.INPUT_Sign:
						return "string";
					default:
						break;
				}
			}
			case RSUtils.TAG_SignPole:
				return "list";
			default:
				break;
		}
		return "link";
    }

    // Creates list of items based on the given property
	public string[] GetPropertyElementList(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RSUtils.TAG_SignPole)
		{
			string[] ret = new string[0];
			ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.Pole_None);
			if (SignEntries[SignSelection].bPole230cmOnly)
			{
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.Pole_230cm);
			}
			else
			{
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.Pole_100cm);
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.Pole_200cm);
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.Pole_300cm);
			}
			return ret;
		}
		
		return inherited(PropertyID);
	}

	public void SetPropertyValue(string PropertyID, string value)
	{
		if (value == null or value == "") return;
		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
				AdditionalSignData = value;
				break;
			case RSUtils.TAG_SignPole:
				UpdateSignPoleMesh(RSUtils.GetSignPoleFlagFromHtmlText(value));
				break;
			default:
				inherited(PropertyID, value);
				break;
		}
	}

	// Additional data input for integer values
	public void SetPropertyValue(string PropertyID, int value)
	{		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
				AdditionalSignData = RSUtils.FormatIntInput(value);
				break;
			default:
				inherited(PropertyID, value);
				break;
		}
	}

	// Additional data input for float values
	public void SetPropertyValue(string PropertyID, float value)
	{		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
				AdditionalSignData = RSUtils.FormatFloatInput(value);
				break;
			default:
				inherited(PropertyID, value);
				break;
		}
	}
};