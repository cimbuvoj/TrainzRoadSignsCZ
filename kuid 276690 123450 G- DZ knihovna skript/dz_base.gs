// =================================
// dz_base.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "MapObject.gs"

static final class RoadSignUtils
{
	define public int TAG_SignSelection 		= 0;
	define public int TAG_ShowPole 				= 1;
	define public int TAG_InputEntry 			= 2;
	define public int TAG_SignAdditionalData 	= 3;

	define public int INPUT_None 	= 0;
	define public int INPUT_Int 	= 1;
	define public int INPUT_Float	= 2;
	define public int INPUT_Sign	= 3;
};

class SignData
{
	public string Name;
	public string ImagePath;
	public int InputType = RoadSignUtils.INPUT_None;
	public float AdditionalData = 0.0;

	public void SetData(string InName, string InImagePath, int InInputType, float InAdditionalData)
	{
		Name = InName;
		ImagePath = InImagePath;
		InputType = InInputType;
		AdditionalData = InAdditionalData;
	}

	public void SetData(string InName, string InImagePath)
	{
		SetData(InName, InImagePath, RoadSignUtils.INPUT_None, 0.0);
	}
};

class DZBase isclass MapObject
{
	// Array of entries for HTML, user defines a new entry and everything else is handled internally
	public SignData[] SignEntries;

	// Index of sign mesh that should be visible
	int SignSelection = 0;

	// By default we want to show the stand
	bool bShowPole = true;

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
		//SetMeshVisible("sloup", bShowPole, 0);
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			// SetMeshVisible("znacka"+i, i == SignSelection, 0);
		}
	}

	string FormatFloatInput(float Value)
	{
		string FormattedString = Value;

		if (Value == (int)Value)
		{
			Str.Left(FormattedString, 1);
		}
		else
		{
			Str.Left(FormattedString, 3);
		}
		
		return FormattedString;
	}

	string FormatIntInput(int Value)
	{
		// Clamp into allowed range
		Value = Math.Max(Value, 0);
		Value = Math.Min(Value, 150);
		
		return (string) Value;
	}
	
	// ======================
	// Save and Load
	// ======================
	// Load
	public void SetProperties(Soup Properties)
	{
		inherited(Properties);

		SignSelection 		= Properties.GetNamedTagAsInt(RoadSignUtils.TAG_SignSelection, 0);
		bShowPole 			= Properties.GetNamedTagAsBool(RoadSignUtils.TAG_ShowPole, true);
		AdditionalSignData 	= Properties.GetNamedTag(RoadSignUtils.TAG_SignAdditionalData);

		ResetMeshes();
	}

	// Save
	public Soup GetProperties()
	{
		Soup Properties = inherited();

		Properties.SetNamedTag(RoadSignUtils.TAG_SignSelection, SignSelection);
		Properties.SetNamedTag(RoadSignUtils.TAG_ShowPole, bShowPole);
		Properties.SetNamedTag(RoadSignUtils.TAG_SignAdditionalData, AdditionalSignData);

		return Properties;
	}

	// ======================
	// HTML
	// ======================
	string Img(int w, int h, string src)
	{
		return "<img width=" + w + " height=" + h + " src=\"" + src + "\"></img>";
	}

	string RadioButton(string Property, bool Value)
	{
		return HTMLWindow.RadioButton("live://property/" + Property, Value);
	}

	string Checkbox(int Property, bool Value)
	{
		return HTMLWindow.CheckBox("live://property/" + (string)Property, Value);
	}

	string InputField(string Property, string Tooltip, string Text)
	{
		return "<td align=left valign=center><font size=2 face=Consolas color=#ffffff><a tooltip=\""+Tooltip+"\" href=live://property/"+Property+">"+Text+"</a></font></td>";
	}

	string Td(string Text, string ImagePath, int Idx)
	{
		string FontColor = "#ffffff";
		// Highlighted signs will get highlighted text
		if (Str.Find(ImagePath, "z", ImagePath.size() - 5) > 0)
		{
			FontColor = "#F4E601";
		}
		return
			"<td width=1% valign=center align=center>" + RadioButton(RoadSignUtils.TAG_SignSelection + "/" + Idx, SignSelection == Idx) + "</td>"+
			"<td width=1% valign=center align=center>" + Img(50, 50, ImagePath) + "</td>"+
			"<td valign=center width=31%><font size=1 face=Consolas color=" + FontColor + ">" + Text + "</font></td>";
	}

	public string CreateHTML(string Title)
	{
		string html = "<html><body>"+
			"<table width=100% bgcolor=#333333>"+
				"<tr>"+
					"<td bgcolor=#EECFA1 colspan=6 align=center><font size=5 face=Consolas color=#000000><b>DOPRAVNÍ ZNAČKY - " + Title + "</b></font></td>"+
				"</tr>"+
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> Má sloup " + Checkbox(RoadSignUtils.TAG_ShowPole, bShowPole) +"</font></td>"+
				"</tr>";
		if (SignEntries[SignSelection].InputType != RoadSignUtils.INPUT_None)
		{
			// This road sign requires additional input data
			if (AdditionalSignData == null)
			{
				// Default value
				switch (SignEntries[SignSelection].InputType)
				{
					case RoadSignUtils.INPUT_Int:
						AdditionalSignData = FormatIntInput((int) SignEntries[SignSelection].AdditionalData);
						break;
					case RoadSignUtils.INPUT_Float:
						AdditionalSignData = FormatFloatInput(SignEntries[SignSelection].AdditionalData);
						break;
					case RoadSignUtils.INPUT_Sign:
						AdditionalSignData = ""; // TODO
						break;
					default:
						break;
				}
			}

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> Data navíc " + InputField(RoadSignUtils.TAG_InputEntry + "/" + SignSelection, "Zadej", AdditionalSignData) +"</font></td>"+
				"</tr>";
		}
				

		Interface.Log("size " + SignEntries.size());
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			// Even index = start row, odd index = end row
			bool bAddStartRow = (i % 2) == 0;
			if (bAddStartRow)
			{
				html = html + "<tr height=50>";
			}
			html = html + Td(SignEntries[i].Name, SignEntries[i].ImagePath, i);
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
			case RoadSignUtils.TAG_SignSelection:
			{
				// SetMeshVisible("znacka"+SignSelection, false, 0);
				SignSelection = Str.ToInt(TagParser[1]);
				// SetMeshVisible("znacka"+SignSelection, true, 0);

				AdditionalSignData = "";
				break;
			}
			case RoadSignUtils.TAG_ShowPole:
			{
				bShowPole = !bShowPole;
				// SetMeshVisible("sloup", false, 0);
				break;
			}
			default:
				break;
		}
	}

	// Sets title to the input dialog
	public string GetPropertyName(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RoadSignUtils.TAG_InputEntry)
		{
			return "Zadej";
		}
		return inherited(PropertyID);
	}

	// Adds the current value to the input dialog
	public string GetPropertyValue(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RoadSignUtils.TAG_InputEntry)
		{
			return AdditionalSignData;
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
			case RoadSignUtils.TAG_InputEntry:
			{
				int CurrentSignSelection = Str.ToInt(TagParser[1]);
				switch (SignEntries[CurrentSignSelection].InputType)
				{
					case RoadSignUtils.INPUT_Int:
						// Any integer, speed can be up to 150 now
						return "int,0,150,1";
					case RoadSignUtils.INPUT_Float:
						// Usually for width of vehicles, 9.9 is enough
						return "float,0,9.9,0.1";
					case RoadSignUtils.INPUT_Sign:
						return "string";
					default:
						break;
				}
			}
			default:
				break;
		}
		return "link";
    }

	public void SetPropertyValue(string PropertyID, string value)
	{
		if (value == null or value == "") return;
		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RoadSignUtils.TAG_InputEntry)
		{
			AdditionalSignData = value;
		}
		else
		{
			inherited(PropertyID, value);
		}
	}

	// Additional data input for integer values
	public void SetPropertyValue(string PropertyID, int value)
	{		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RoadSignUtils.TAG_InputEntry)
		{
			AdditionalSignData = FormatIntInput(value);
		}
		else
		{
			inherited(PropertyID, value);
		}
	}

	// Additional data input for float values
	public void SetPropertyValue(string PropertyID, float value)
	{		
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RoadSignUtils.TAG_InputEntry)
		{
			AdditionalSignData = FormatFloatInput(value);
		}
		else
		{
			inherited(PropertyID, value);
		}
	}
};