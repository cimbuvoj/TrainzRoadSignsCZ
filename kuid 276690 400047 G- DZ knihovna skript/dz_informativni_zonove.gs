/// ============================================
/// @file   dz_informativni_zonove.gs
/// @author Vojtech Cimbura, 2025
/// ============================================

include "dz_base.gs"

class DZInformativniZonove isclass DZBase
{
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("IZ 1a Dálnice", 							"img/iz1a.png");
		SignEntries[EmplaceEntry()].SetData("IZ 1b Konec dálnice", 						"img/iz1b.png");
		SignEntries[EmplaceEntry()].SetData("IZ 2a Silnice pro motorová vozidla", 		"img/iz2a.png");
		SignEntries[EmplaceEntry()].SetData("IZ 2b Konec silnice pro motorová vozidla", "img/iz2b.png");
		SignEntries[EmplaceEntry()].SetData("IZ 3a Tunel", 								"img/iz3a.png");
	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("INFORMATIVNÍ ZÓNOVÉ");
	}
};