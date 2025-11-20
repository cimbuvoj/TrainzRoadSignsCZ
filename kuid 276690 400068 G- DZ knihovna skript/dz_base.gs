/// ============================================
/// @file   dz_base.gs
/// @author Vojtech Cimbura
/// ============================================

include "mapobject.gs"
include "dz_lib.gs"


/// @brief Configuration holder of each sign
class SignData
{
	/// @brief Shown HTML text
	public string Name = null;
	/// @brief Relative path to the HTML image
	public string ImagePath = null;
	/// @brief Sign property flags, currently used bits 1-6, see INPUT_<Name> in RSUtils
	public int SignFlags = 0;
	/// @brief Sign additional data, such as speed or maximum vehicle weight specified on the sign by default
	/// @detail Can contain string values, but also can store floats and integers
	public string AdditionalData = null;

	// ============================================
	// Data setters, various parameters
	// ============================================

	public void SetData(string InName, string InImagePath, int InSignFlags, float InAdditionalData)
	{
		Name = InName;
		ImagePath = InImagePath;
		SignFlags = InSignFlags;
		AdditionalData = (string) InAdditionalData;
	}

	public void SetData(string InName, string InImagePath, int InSignFlags, int InAdditionalData)
	{
		Name = InName;
		ImagePath = InImagePath;
		SignFlags = InSignFlags;
		AdditionalData = (string) InAdditionalData;
	}

	public void SetData(string InName, string InImagePath, int InSignFlags, string InAdditionalData)
	{
		Name = InName;
		ImagePath = InImagePath;
		SignFlags = InSignFlags;
		AdditionalData = InAdditionalData;
	}

	public void SetData(string InName, string InImagePath, int InSignFlags)
	{
		SetData(InName, InImagePath, InSignFlags, null);
	}

	public void SetData(string InName, string InImagePath)
	{
		SetData(InName, InImagePath, RSUtils.INPUT_None, null);
	}
};

/// @brief Base class for all sign, inherit from it to add other types and add entires in Init()
class DZBase isclass MapObject
{
	/// @brief  Array of entries for HTML, user defines a new entry and everything else is handled internally
	public SignData[] SignEntries;

	/// @brief Index of sign mesh that should be visible
	int SignSelection = 0;

	/// @brief Flag bitfield, currently used bits: 1-5 pole types, 16 sign base, the rest is free to use 
	int Customization = RSUtils.CUST_DefaultValues;

	/// @brief Additional data, such as speed or other values
	string AdditionalSignData = null;

	/// @brief Signs that should share the same position as this object
	GameObjectID[] AssociatedSignIDs;

	// ============================================
	// Function declarations
	// ============================================

	/// @brief Called when this object enters the scene ('Constructor')
	void Init();

	/// @brief Adds a new element into SignEntries
	/// @return The index on which the newly added array element resides
	public int EmplaceEntry();

	/// @brief Ensures all sign related meshes are shown based on current configuration
	void ApplyMeshes();

	/// @brief Hides or shows the sign clip mesh, translates it to correct position
	/// @param bState Whether to show or hide the sign clip mesh
	void UpdateSignClipMesh(bool bState);

	/// @brief Hides the sign pole mesh or shows the one specified by the incoming flag
	/// @param NewPoleBit Type of sign pole mesh to show (or hide)
	void UpdateSignPoleMesh(int NewPoleBit);

	/// @brief Hides or shows the sign base mesh
	/// @param bState Whether to show or hide the sign base mesh
	void UpdateSignBaseMesh(bool bState);

	/// @brief Processes all associated signs and sets their position and rotation to match this object
	void UpdateAssociatedSigns();

	/// @brief Restores object state with a Soup object returned from a previous call to GetProperties()
	/// @detail Called by Trainz whenever this objec should *LOAD* it's configuration
	/// @param Properties Reference to soup to be saved to session
	public void SetProperties(Soup Properties);

	/// @brief Restores object state with a Soup object returned from a previous call to GetProperties()
	/// @detail Called by Trainz whenever this objec should *SAVE* it's configuration
	/// @return Soup object containing data appropriate to represent the configured state of the object
	public Soup GetProperties();

	/// @brief Construct HTML for this sign object
	/// @param Title Sign title category to display at the top
	/// @return Valid HTML in a string
	public string CreateHTML(string Title);

	/// @brief Called by Trainz when the player clicks on a "link" property type (checkbox, radio button)
	/// @param PropertyID Name of property
	public void LinkPropertyValue(string PropertyID);

	/// @brief Called by Trainz to get a string representation of the current name of the selected property
	/// @param PropertyID Name of property
	/// @return The name of the current property
	public string GetPropertyName(string PropertyID);

	/// @brief Called by Trainz to get a string representation of the current value of the selected property, if possible
	/// @param PropertyID Name of property
	/// @return A string representation of the value of the current property
	public string GetPropertyValue(string PropertyID);

	/// @brief Called by Trainz to determine the type of the named property in HTML
	/// @param PropertyID Name of property
	/// @return The type of the current property
	public string GetPropertyType(string PropertyID);

	/// @brief Called by Trainz to retrieve a list possible values for a named property, used for the "list" type
	/// @param PropertyID Name of property
	/// @return A string array for the player to select a value from
	public string[] GetPropertyElementList(string PropertyID);

	/// @brief Sets a new value for the named property
	/// @detail The variant called depends on the property type, as returned by GetPropertyType()
	/// @param PropertyID Name of property
	/// @param value Value to assign to the property
	public void SetPropertyValue(string PropertyID, string value);

	/// @brief Sets a new value for the named property
	/// @detail The variant called depends on the property type, as returned by GetPropertyType()
	/// @param PropertyID Name of property
	/// @param value Value to assign to the property
	public void SetPropertyValue(string PropertyID, int value);

	/// @brief Sets a new value for the named property
	/// @detail The variant called depends on the property type, as returned by GetPropertyType()
	/// @param PropertyID Name of property
	/// @param value Value to assign to the property
	public void SetPropertyValue(string PropertyID, float value);


	// ============================================
	// Function definitions
	// ============================================

	void Init()
	{
		inherited();

		SignEntries = new SignData[0];
		AssociatedSignIDs = new GameObjectID[0];
	}

	public int EmplaceEntry()
	{
		int Index = SignEntries.size();
		SignEntries[Index] = new SignData();
		return Index;
	}

	void ApplyMeshes()
	{
		// Apply sign pole and clip
		string MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			SetMeshVisible(MeshName, true, 0.0f);
		}

		UpdateSignClipMesh(true);

		// Sign base
		SetMeshVisible(RSUtils.CFG_Base, (bool) (Customization & RSUtils.CUST_Base), 0.0f);

		// Sign type
		int i;
		for (i = 0; i < SignEntries.size(); ++i)
		{
			MeshName = RSUtils.GetSignConfigTag(i);
			SetMeshVisible(MeshName, i == SignSelection, 0.0f);
			SetMeshTranslation(MeshName, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));
		}
	}

	void UpdateSignClipMesh(bool bState)
	{
		string MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, Customization);
		if (MeshName == null)
		{
			// This is a situation when there is no pole - we want to show sign clip in default position
			int TargetClipType = RSUtils.CUST_Pole_300cm;
			if (SignEntries[SignSelection].SignFlags & RSUtils.INPUT_Pole230cm)
			{
				TargetClipType = RSUtils.CUST_Pole_230cm;
			}
			MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Clip, TargetClipType);	
		}
		
		SetMeshVisible(MeshName, bState, 0.0f);
		if (bState)
		{
			float ClipOffsetZ = 0.0f;
			if (SignEntries[SignSelection].SignFlags & RSUtils.INPUT_LowerClip)
			{
				ClipOffsetZ = -0.15f;
			}
			SetMeshTranslation(MeshName, 0.0f, 0.0f, ClipOffsetZ);
		}
	}

	void UpdateSignPoleMesh(int NewPoleBit)
	{
		// Reset previous mesh if it is a valid mesh name
		string MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			// Hide pole mesh
			SetMeshVisible(MeshName, false, 0.0f);
		}
		UpdateSignClipMesh(false);

		// Clear pole bits
		Customization = Customization & ~RSUtils.CUST_PoleValuesAll;

		// Assign new pole type
		Customization = Customization | NewPoleBit;

		// Make the new mesh visible if it is a valid mesh name
		MeshName = RSUtils.GetSignPoleOrClipConfigTag(RSUtils.CFG_Pole, Customization);
		if (MeshName != null)
		{
			// Show pole mesh
			SetMeshVisible(MeshName, true, 0.0f);
		}
		UpdateSignClipMesh(true);
	}

	void UpdateSignBaseMesh(bool bState)
	{
		int NewValue = ((int)bState) * RSUtils.CUST_Base;
		Customization = Customization & ~RSUtils.CUST_Base;
		Customization = Customization | NewValue;
		SetMeshVisible(RSUtils.CFG_Base, bState, 0.0f);
	}

	void UpdateAssociatedSigns()
	{
		int i;
		for (i = 0; i < AssociatedSignIDs.size(); ++i)
		{
			DZBase SignObject = cast<DZBase>(Router.GetGameObject(AssociatedSignIDs[i]));

			if (SignObject)
			{
				SignObject.SetMapObjectOrientation(GetMapObjectOrientation());
				SignObject.SetMapObjectPosition(GetMapObjectPosition());
			}
		}
	}

	public void SetProperties(Soup Properties)
	{
		inherited(Properties);

		SignSelection 		= Properties.GetNamedTagAsInt(RSUtils.TAG_SignSelection, 0);
		Customization		= Properties.GetNamedTagAsInt(RSUtils.TAG_SignPole, RSUtils.CUST_DefaultValues);
		AdditionalSignData 	= Properties.GetNamedTag(RSUtils.TAG_SignAdditionalData);
		int AssociatedSignIDsSize 	= Properties.GetNamedTagAsInt(RSUtils.TAG_NumAssociatedSignIDs, 0);
		
		int i;
		for (i = 0; i < AssociatedSignIDsSize; ++i)
		{
			GameObjectID SignID = Properties.GetNamedTagAsGameObjectID(RSUtils.TAG_AssociatedSignID + "/"+ i);

			if (RSUtils.IsValid(SignID))
			{
				AssociatedSignIDs[i] = SignID;
			}
		}

		ApplyMeshes();
	}

	public Soup GetProperties()
	{
		Soup Properties = inherited();

		Properties.SetNamedTag(RSUtils.TAG_SignSelection, SignSelection);
		Properties.SetNamedTag(RSUtils.TAG_SignPole, Customization);
		Properties.SetNamedTag(RSUtils.TAG_SignAdditionalData, AdditionalSignData);
		Properties.SetNamedTag(RSUtils.TAG_NumAssociatedSignIDs, AssociatedSignIDs.size());

		int i;
		for (i = 0; i < AssociatedSignIDs.size(); ++i)
		{
			if (!RSUtils.IsValid(AssociatedSignIDs[i]))
			{
				AssociatedSignIDs[i, i+1] = null;
				continue;
			}
			Properties.SetNamedTag(RSUtils.TAG_AssociatedSignID + "/" + i, AssociatedSignIDs[i]);		
		}

		UpdateAssociatedSigns();

		return Properties;
	}

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
			bool bShowBase = Customization & RSUtils.CUST_Base;
			string BaseHtml = RSUtils.TEXT_NoBaseHTML;
			if (RSUtils.IsSignPoleVisible(Customization))
			{
				BaseHtml = RSUtils.Checkbox(RSUtils.TAG_SignBase, bShowBase);
			}

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_BaseHTML + ": " + BaseHtml +"</font></td>"+
				"</tr>";
		}

		// Sign - Pole and Clip
		{
			string PoleHtmlText = RSUtils.GetCurrentSignPoleHtmlText(Customization);
			int PoleValue = Customization & RSUtils.CUST_PoleValuesAll;

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_PoleHTML + " : " +
					RSUtils.InputField(RSUtils.TAG_SignPole + "/" + PoleValue, RSUtils.TEXT_EnterHTML, PoleHtmlText) +"</font></td>"+
				"</tr>";
		}

		// Sign - Additional data
		int AdditionalInputSignFlags = SignEntries[SignSelection].SignFlags & RSUtils.INPUT_AdditionalInputFlags;
		bool bIsAdditionalInputDefined = AdditionalInputSignFlags & ~RSUtils.INPUT_None;
		if (bIsAdditionalInputDefined)
		{
			// This road sign requires additional input data
			if (AdditionalSignData == null)
			{
				// Set default value
				switch (AdditionalInputSignFlags)
				{
					case RSUtils.INPUT_Int:
						AdditionalSignData = RSUtils.FormatIntInput(Str.ToInt(SignEntries[SignSelection].AdditionalData));
						break;
					case RSUtils.INPUT_Float:
						AdditionalSignData = RSUtils.FormatFloatInput(Str.ToFloat(SignEntries[SignSelection].AdditionalData));
						break;
					case RSUtils.INPUT_String:
						AdditionalSignData = ""; // TODO Might be used in the future
						break;
					default:
						break;
				}
			}

			html = html +
				"<tr height=30>"+
					"<td colspan=6><font size=2 face=Consolas color=#ffffff> " + RSUtils.TEXT_ExtraDataHTML + " " +
					RSUtils.InputField(RSUtils.TAG_InputEntry + "/" + SignSelection, "NEFUNKCNI - BUDE VE VERZI v1.0", AdditionalSignData) +"</font></td>"+
				"</tr>";
		}

		// Associated signs
		{
			string SearchImg = "<img src=img/search.png></img>";
			string CrossImg = "<img src=img/cross.png></img>";

			string Tooltip = "Přidej značku, která bude kopírovat pozici této značky. Nejdříve tuto značku umísti, poté přidej přidruženou značku.";

			html = html + "</table><table width=100% bgcolor=#333333>"+
				"<tr>"+
					"<td colspan=2 align=left><font size=2 face=Consolas color=#ffffff><b> Přidružené značky</b></font></td>"+
					"<td align=center>" + RSUtils.InputField(RSUtils.TAG_AssociatedSignID, Tooltip, SearchImg+"Přidat") + "</td>"+
				"</tr>";

			int i;
			for (i = 0; i < AssociatedSignIDs.size(); ++i)
			{
				string Name = RSUtils.GetObjectName(AssociatedSignIDs[i]);
				html = html +
					"<tr>"+
						"<td colspan=2 align=left><font size=2 face=Consolas color=#00ffff>  " + Name + "</font></td>"+
						"<td align=left>" + RSUtils.InputField(RSUtils.TAG_DelAssociatedSignID + "/" + i, "Vymaže značku " + Name, CrossImg) + "</td>"+
					"</tr>";
			}
			html = html + "</table>";
		}

		// Print sign matrix
		{
			html = html + "<table width=100% bgcolor=#333333>";

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

			// Odd number of elements - end last row
			bool bAddLastEmpty = (SignEntries.size() % 2) == 1;
			if (bAddLastEmpty)
			{
				html = html + "</tr>";
			}
			html = html + "</table>";
		}

		return html + "</body></html>";
	}

	public void LinkPropertyValue(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);
		
		switch(nID)
		{
			case RSUtils.TAG_SignSelection:
			{
				string MeshName = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshVisible(MeshName, false, 0.0f);
				UpdateSignClipMesh(false);

				bool bOld230cmPoleOption = SignEntries[SignSelection].SignFlags & RSUtils.INPUT_Pole230cm;

				SignSelection = Str.ToInt(TagParser[1]);
				
				bool bNew230cmPoleOption = SignEntries[SignSelection].SignFlags & RSUtils.INPUT_Pole230cm;
				AdditionalSignData = "";

				// Update sign pole and clip position
				if (RSUtils.IsSignPoleVisible(Customization))
				{
					if (!bOld230cmPoleOption and bNew230cmPoleOption)
					{
						// Switching from default pole type to special pole type
						UpdateSignPoleMesh(RSUtils.CUST_Pole_230cm);
					}					
					else if (bOld230cmPoleOption and !bNew230cmPoleOption)
					{
						// Switching from special pole type to default type
						UpdateSignPoleMesh(RSUtils.CUST_Pole_300cm);
					}
				}
				else if (Customization & RSUtils.CUST_Base)
				{
					// Hide sign base as there is no sign pole
					UpdateSignBaseMesh(false);
				}
				
				// Always update the sign clip mesh position
				UpdateSignClipMesh(true);

				// Sign mesh
				MeshName = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshVisible(MeshName, true, 0.0f);
				SetMeshTranslation(MeshName, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));
				
				break;
			}
			case RSUtils.TAG_SignBase:
			{
				if (RSUtils.IsSignPoleVisible(Customization))
				{
					// Checkbox - flip flop value
					bool bBaseVisible = (bool) (Customization & RSUtils.CUST_Base);
					UpdateSignBaseMesh(!bBaseVisible);
				}
				break;
			}
			case RSUtils.TAG_DelAssociatedSignID:
			{
				int IdxToRemove = Str.ToInt(TagParser[1]);
				AssociatedSignIDs[IdxToRemove, IdxToRemove + 1] = null;
				break;
			}
			default:
				break;
		}
	}

	public string GetPropertyName(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
			case RSUtils.TAG_AssociatedSignID:
				return RSUtils.TEXT_EnterHTML;
			case RSUtils.TAG_SignPole:
				return RSUtils.TEXT_ChooseHTML;
			default:
				break;
		}

		return inherited(PropertyID);
	}

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

	public string GetPropertyType(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);
		
		switch(nID)
		{
			case RSUtils.TAG_InputEntry:
			{
				int CurrentSignSelection = Str.ToInt(TagParser[1]);
				int AdditionalInputSignFlags = SignEntries[SignSelection].SignFlags & RSUtils.INPUT_AdditionalInputFlags;
				switch (AdditionalInputSignFlags)
				{
					case RSUtils.INPUT_Int:
						// Any integer, speed can be up to 150kph now in CZ
						return "int,5,150,5";
					case RSUtils.INPUT_Float:
						// Usually for width or height of vehicles, 9.9 is enough
						return "float,0,9.9,0.1";
					case RSUtils.INPUT_String:
						return "string";
					default:
						break;
				}
			}
			case RSUtils.TAG_SignPole:
				return "list";
			case RSUtils.TAG_AssociatedSignID:
				return "string";
			default:
				break;
		}
		return "link";
    }

	public string[] GetPropertyElementList(string PropertyID)
	{
		string[] TagParser = Str.Tokens(PropertyID, "/");
		int nID = Str.ToInt(TagParser[0]);

		if (nID == RSUtils.TAG_SignPole)
		{
			string[] ret = new string[0];
			ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.CUST_Pole_None);
			if (SignEntries[SignSelection].SignFlags & RSUtils.INPUT_Pole230cm)
			{
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.CUST_Pole_230cm);
			}
			else
			{
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.CUST_Pole_100cm);
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.CUST_Pole_200cm);
				ret[ret.size()] = RSUtils.GetCurrentSignPoleHtmlText(RSUtils.CUST_Pole_300cm);
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

				// Also move the sign to the correct vertical position
				string MeshName = RSUtils.GetSignConfigTag(SignSelection);
				SetMeshTranslation(MeshName, 0.0f, 0.0f, RSUtils.GetSignHeightFromPole(Customization));

				if (!RSUtils.IsSignPoleVisible(Customization))
				{
					// Hide sign base if there is no sign pole
					UpdateSignBaseMesh(false);
				}
				break;
			}
			case RSUtils.TAG_AssociatedSignID:
			{
				GameObjectID SignID = Router.SerialiseGameObjectIDFromString(value);
				if (SignID)
				{
					if (SignID.DoesMatch(me.GetGameObjectID()))
					{
						// Do not add self
						return;
					}

					int i = 0;
					for (i = 0; i < AssociatedSignIDs.size(); ++i)
					{
						if (SignID.DoesMatch(AssociatedSignIDs[i]))
						{
							// Avoid duplicates
							return;
						}
					}

					DZBase SignObject = cast<DZBase>(Router.GetGameObject(SignID));

					// Add only if the sign exists in the world
					if (SignObject)
					{
						AssociatedSignIDs[AssociatedSignIDs.size()] = SignID;

						SignObject.UpdateSignPoleMesh(RSUtils.CUST_Pole_None); // Note: This causes to log 'null string at parameter 1 (file meshobject.gs)', unknown reason
						SignObject.UpdateSignBaseMesh(false); // Note: This causes to log 'null string at parameter 1 (file meshobject.gs)', unknown reason
						SignObject.SetMapObjectOrientation(GetMapObjectOrientation());
						SignObject.SetMapObjectPosition(GetMapObjectPosition());
					}
				}
				break;
			}
			default:
				inherited(PropertyID, value);
				break;
		}
	}

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