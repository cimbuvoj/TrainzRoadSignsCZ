// =================================
// dz_base.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "MapObject.gs"
include "dz_lib.gs"


// Configuration of each sign type
class SignData
{
	public string Name;
	public string ImagePath;
	public int InputType = RSUtils.INPUT_None;
	public float AdditionalData = 0.0f;
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
		SetData(InName, InImagePath, RSUtils.INPUT_None, 0.0f, bInPole230cmOnly);
	}

	public void SetData(string InName, string InImagePath)
	{
		SetData(InName, InImagePath, RSUtils.INPUT_None, 0.0f, false);
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
		SetMeshVisible(RSUtils.CFG_Base, (bool) (Customization & RSUtils.BaseEnable_Bit), 0.0f);

		// Sign pole + clip
		SetMeshVisible(RSUtils.CFG_Pole + "01", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Pole + "02", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Pole + "03", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Pole + "04", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Clip + "01", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Clip + "02", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Clip + "03", false, 0.0f);
		SetMeshVisible(RSUtils.CFG_Clip + "04", false, 0.0f);

		string MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			SetMeshVisible(MeshName, (bool) (Customization & RSUtils.Default_PoleValuesAll), 0.0f);
		}

		MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
		if (MeshName != null)
		{
			SetMeshVisible(MeshName, (bool) (Customization & RSUtils.Default_PoleValuesAll), 0.0f);
		}

		// Sign type
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			string MeshName = RSUtils.GetSignConfigTag(i);
			SetMeshVisible(MeshName, i == SignSelection, 0.0f);
			SetMeshTranslation(MeshName, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));
		}
	}

	// Sets the customization bit for sign pole to defined value and updates meshes accordingly
	void UpdateSignPoleMesh(int NewPoleBit)
	{
		// Reset previous mesh if it is a valid mesh name
		string MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			//Hhide pole mesh
			SetMeshVisible(MeshName, false, 0.0f); 

			// Hide clip mesh
			MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
			SetMeshVisible(MeshName, false, 0.0f); 
		}

		// Clear pole bits
		Customization = Customization & ~RSUtils.Default_PoleValuesAll;

		// Assign new pole type
		Customization = Customization | NewPoleBit;

		// Make the new mesh visible if it is a valid mesh name
		MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			// Show pole mesh
			SetMeshVisible(MeshName, true, 0.0f); 

			// Show clip mesh
			MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
			SetMeshVisible(MeshName, true, 0.0f); 
		}
	}

	// Call this once to flip the sign base state
	void UpdateSignBaseMesh()
	{
		// Flip the sign base bit
		Customization = Customization ^ RSUtils.BaseEnable_Bit;
		SetMeshVisible(RSUtils.CFG_Base, (bool) (Customization & RSUtils.BaseEnable_Bit), 0.0f);
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
					"<td bgcolor=#EECFA1 colspan=6 align=center><font size=5 face=Consolas color=#000000><b>" + RSUtils.TEXT_TitleHTML + " - " + Title + "</b></font></td>"+
				"</tr>";

		// Sign - Base
		{
			bool bShowBase = Customization & RSUtils.BaseEnable_Bit;

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_BaseHTML + " " + RSUtils.Checkbox(RSUtils.TAG_SignBase, bShowBase) +"</font></td>"+
				"</tr>";
		}

		// Sign - Pole and Clip
		{
			string PoleHtmlText = RSUtils.GetCurrentSignPoleHtmlText(Customization);
			int PoleValue = Customization & RSUtils.Default_PoleValuesAll;

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_PoleHTML + " " + RSUtils.InputField(RSUtils.TAG_SignPole + "/" + PoleValue, "Zadej", PoleHtmlText) +"</font></td>"+
				"</tr>";
		}

		// Sign - Additional data
		if (SignEntries[SignSelection].InputType != RSUtils.INPUT_None)
		{
			// This road sign requires additional input data
			string Tooltip = "Zadej";
			if (AdditionalSignData == null)
			{
				// Default value
				switch (SignEntries[SignSelection].InputType)
				{
					case RSUtils.INPUT_Int:
						AdditionalSignData = RSUtils.FormatIntInput((int) SignEntries[SignSelection].AdditionalData);
						Tooltip = "Zadej rychlost na značce";
						break;
					case RSUtils.INPUT_Float:
						AdditionalSignData = RSUtils.FormatFloatInput(SignEntries[SignSelection].AdditionalData);
						Tooltip = "Zadej číslo na značce";
						break;
					case RSUtils.INPUT_Sign:
						AdditionalSignData = ""; // TODO
						Tooltip = "Zadej text na značce";
						break;
					default:
						break;
				}
			}

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_ExtraDataHTML + " " + RSUtils.InputField(RSUtils.TAG_InputEntry + "/" + SignSelection, Tooltip, AdditionalSignData) +"</font></td>"+
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
				SetMeshVisible(RSUtils.GetSignConfigTag(SignSelection), false, 0.0f);

				SignSelection = Str.ToInt(TagParser[1]);
				
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
				else if (Customization & RSUtils.BaseEnable_Bit)
				{
					// Hide sign base if there is no sign pole
					UpdateSignBaseMesh();
				}

				string NewSignMesh = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshVisible(NewSignMesh, true, 0.0f);
				SetMeshTranslation(NewSignMesh, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));
				
				break;
			}
			case RSUtils.TAG_SignBase:
			{
				bool bIsPoleHidden = Customization & RSUtils.Pole_None;
				if (!bIsPoleHidden)
				{
					UpdateSignBaseMesh();
				}
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
			{
				UpdateSignPoleMesh(RSUtils.GetSignPoleFlagFromHtmlText(value));

				// Also move the sign to the correct location
				string NewSignMesh = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshTranslation(NewSignMesh, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));

				// Pole types without 'no pole' option - Mask for clearing up pole selection bits
				int PoleBitsExceptNone = RSUtils.Default_PoleValuesAll & ~RSUtils.Pole_None;
				bool bIsPoleSelected = Customization & PoleBitsExceptNone;
				if (!bIsPoleSelected and Customization & RSUtils.BaseEnable_Bit)
				{
					// Hide sign base if there is no sign pole
					UpdateSignBaseMesh();
				}
				break;
			}

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