// =================================
// dz_upravujici_prednost.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "dz_base.gs"

class DZUpravujiciPrednost isclass DZBase
{
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("P 1 Křižovatka s vedlejší pozemní komunikací", "img/p1.png");
		SignEntries[EmplaceEntry()].SetData("P 2 Hlavní pozemní komunikace", 				"img/p2.png");
		SignEntries[EmplaceEntry()].SetData("P 3 Konec hlavní pozemní komunikace", 			"img/p3.png");
		SignEntries[EmplaceEntry()].SetData("P 4 Dej přednost v jízdě!", 					"img/p4.png");
		SignEntries[EmplaceEntry()].SetData("P 4 Dej přednost v jízdě!", 					"img/p4z.png");
		SignEntries[EmplaceEntry()].SetData("P 5 Dej přednost v jízdě tramvaji!", 			"img/p5.png");
		SignEntries[EmplaceEntry()].SetData("P 6 Stůj, dej přednost v jízdě!", 				"img/p6.png");
		SignEntries[EmplaceEntry()].SetData("P 6 Stůj, dej přednost v jízdě!", 				"img/p6z.png");
		SignEntries[EmplaceEntry()].SetData("P 7 Přednost protijedoucích vozidel", 			"img/p7.png");
		SignEntries[EmplaceEntry()].SetData("P 8 Přednost před protijedoucími vozidly", 	"img/p8.png");
	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("UPRAVUJÍCÍ PŘEDNOST");
	}
};