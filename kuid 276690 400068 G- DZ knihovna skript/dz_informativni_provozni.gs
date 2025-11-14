/// ============================================
/// @file   dz_informativni_provozni.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "Informativní dopravní značky provozní"
class DZInformativniProvozni isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("IP 2 Zpomalovací práh", 											"img/ip2.png");
		SignEntries[EmplaceEntry()].SetData("IP 3 Podchod nebo nadchod", 										"img/ip3.png");
		SignEntries[EmplaceEntry()].SetData("IP 4b Jednosměrný provoz", 										"img/ip4b.png");
		SignEntries[EmplaceEntry()].SetData("IP 5 Doporučená rychlost", 										"img/ip5.png", RSUtils.INPUT_Int, 70);
		SignEntries[EmplaceEntry()].SetData("IP 6 Přechod pro chodce", 											"img/ip6.png");
		SignEntries[EmplaceEntry()].SetData("IP 6 Přechod pro chodce", 											"img/ip6z.png");
		SignEntries[EmplaceEntry()].SetData("IP 7 Přejezd pro cyklisty", 										"img/ip7.png");
		SignEntries[EmplaceEntry()].SetData("IP 10a Slepá pozemní komunikace", 									"img/ip10a.png");
		SignEntries[EmplaceEntry()].SetData("IP 10b Návěst před slepou pozemní komunikací", 					"img/ip10b.png");				
		SignEntries[EmplaceEntry()].SetData("IP 11a Parkoviště", 												"img/ip11a.png");
		SignEntries[EmplaceEntry()].SetData("IP 11b Parkoviště (kolmé nebo šikmé stání)", 						"img/ip11b.png");
		SignEntries[EmplaceEntry()].SetData("IP 11c Parkoviště (podélné stání)", 								"img/ip11c.png");
		SignEntries[EmplaceEntry()].SetData("IP 11d Parkoviště (stání na chodníku kolmé nebo šikmé)", 			"img/ip11d.png");
		SignEntries[EmplaceEntry()].SetData("IP 11e Parkoviště (stání na chodníku podélné)", 					"img/ip11e.png");
		SignEntries[EmplaceEntry()].SetData("IP 11f Parkoviště (částečné stání na chodníku kolmé nebo šikmé)", 	"img/ip11f.png");
		SignEntries[EmplaceEntry()].SetData("IP 11g Parkoviště (částečné stání na chodníku podélné)", 			"img/ip11g.png");
		SignEntries[EmplaceEntry()].SetData("IP 12 Vyhrazené parkoviště", 										"img/ip12.png");
		SignEntries[EmplaceEntry()].SetData("IP 13a Kryté parkoviště", 											"img/ip13a.png");
		SignEntries[EmplaceEntry()].SetData("IP 13b Parkoviště s parkovacím kotoučem", 							"img/ip13b.png");
		SignEntries[EmplaceEntry()].SetData("IP 13c Parkoviště s parkovacím automatem", 						"img/ip13c.png");
		SignEntries[EmplaceEntry()].SetData("IP 13d Parkoviště P + R", 											"img/ip13d.png");
		SignEntries[EmplaceEntry()].SetData("IP 13e Parkoviště K + R", 											"img/ip13e.png");
		SignEntries[EmplaceEntry()].SetData("IP 26a Obytná zóna", 												"img/ip26a.png");
		SignEntries[EmplaceEntry()].SetData("IP 26b Konec obytné zóny", 										"img/ip26b.png");
		SignEntries[EmplaceEntry()].SetData("IP 31a Měření rychlosti", 											"img/ip31a.png");
		SignEntries[EmplaceEntry()].SetData("IP 31b Konec měření rychlosti", 									"img/ip31b.png");

	}
	
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("INFORMATIVNÍ PROVOZNÍ");
	}
};