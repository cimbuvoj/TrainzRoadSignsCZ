// =================================
// dz_informativni_provozni.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "dz_base.gs"

class DZInformativniProvozni isclass DZBase
{
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("IP 2 Zpomalovací práh", 			"img/ip2.png");
		SignEntries[EmplaceEntry()].SetData("IP 3 Podchod nebo nadchod", 		"img/ip3.png");
		SignEntries[EmplaceEntry()].SetData("IP 4b Jednosměrný provoz", 		"img/ip4b.png");
		SignEntries[EmplaceEntry()].SetData("IP 5 Doporučená rychlost", 		"img/ip5.png", RSUtils.INPUT_Int, 70);
		SignEntries[EmplaceEntry()].SetData("IP 6 Přechod pro chodce", 			"img/ip6.png");
		SignEntries[EmplaceEntry()].SetData("IP 6 Přechod pro chodce", 			"img/ip6z.png");
		SignEntries[EmplaceEntry()].SetData("IP 7 Přejezd pro cyklisty", 		"img/ip7.png");
		SignEntries[EmplaceEntry()].SetData("IP 10a Slepá pozemní komunikace", 	"img/ip10a.png");
		SignEntries[EmplaceEntry()].SetData("IP 10b Návěst před slepou pozemní komunikací", "img/ip10b.png");

	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("INFORMATIVNÍ PROVOZNÍ");
	}
};