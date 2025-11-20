/// ============================================
/// @file   dz_informativni_zonove.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "Informativní dopravní značky zónové"
class DZInformativniZonove isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("IZ 1a Dálnice", 							"img/iz1a.png");
		SignEntries[EmplaceEntry()].SetData("IZ 1b Konec dálnice", 						"img/iz1b.png");
		SignEntries[EmplaceEntry()].SetData("IZ 2a Silnice pro motorová vozidla", 		"img/iz2a.png");
		SignEntries[EmplaceEntry()].SetData("IZ 2b Konec silnice pro motorová vozidla", "img/iz2b.png");
		SignEntries[EmplaceEntry()].SetData("IZ 3a Tunel", 								"img/iz3a.png");
	}
	
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("INFORMATIVNÍ ZÓNOVÉ");
	}
};