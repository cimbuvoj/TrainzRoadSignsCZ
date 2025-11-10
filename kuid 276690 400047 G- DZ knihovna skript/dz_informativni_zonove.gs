// =================================
// dz_informativni_zonove.gs
// Author: Vojtech Cimbura, 2025
// =================================

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

				
		SignEntries[EmplaceEntry()].SetData("IP 11a Parkoviště", 							"img/ip11a.png");
		SignEntries[EmplaceEntry()].SetData("IP 11b Parkoviště (kolmé nebo šikmé stání)", 	"img/ip11b.png");
		SignEntries[EmplaceEntry()].SetData("IP 11c Parkoviště (podélné stání)", 			"img/ip11c.png");
		SignEntries[EmplaceEntry()].SetData("IP 11d Parkoviště (stání na chodníku kolmé nebo šikmé)", 			"img/ip11d.png");
		SignEntries[EmplaceEntry()].SetData("IP 11e Parkoviště (stání na chodníku podélné)", 					"img/ip11e.png");
		SignEntries[EmplaceEntry()].SetData("IP 11f Parkoviště (částečné stání na chodníku kolmé nebo šikmé)", 	"img/ip11f.png");
		SignEntries[EmplaceEntry()].SetData("IP 11g Parkoviště (částečné stání na chodníku podélné)", 			"img/ip11g.png");
		SignEntries[EmplaceEntry()].SetData("IP 12 Vyhrazené parkoviště", 				"img/ip12.png");
		SignEntries[EmplaceEntry()].SetData("IP 13a Kryté parkoviště", 					"img/ip13a.png");
		SignEntries[EmplaceEntry()].SetData("IP 13b Parkoviště s parkovacím kotoučem", 	"img/ip13b.png");
		SignEntries[EmplaceEntry()].SetData("IP 13c Parkoviště s parkovacím automatem", "img/ip13c.png");
		SignEntries[EmplaceEntry()].SetData("IP 13d Parkoviště P + R", 					"img/ip13d.png");
		SignEntries[EmplaceEntry()].SetData("IP 13e Parkoviště K + R", 					"img/ip13e.png");
		SignEntries[EmplaceEntry()].SetData("IP 26a Obytná zóna", 						"img/ip26a.png");
		SignEntries[EmplaceEntry()].SetData("IP 26b Konec obytné zóny", 				"img/ip26b.png");
		SignEntries[EmplaceEntry()].SetData("IP 31a Měření rychlosti", 					"img/ip31a.png");
		SignEntries[EmplaceEntry()].SetData("IP 31b Konec měření rychlosti", 			"img/ip31b.png");
	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("INFORMATIVNÍ ZÓNOVÉ");
	}
};