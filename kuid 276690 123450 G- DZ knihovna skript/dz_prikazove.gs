// =================================
// dz_prikazove.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "dz_base.gs"

class DZPrikazove isclass DZBase
{
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("C 1 Kruhový objezd", 						"img/c1.png");
		SignEntries[EmplaceEntry()].SetData("C 2a Přikázaný směr jízdy přímo", 			"img/c2a.png");
		SignEntries[EmplaceEntry()].SetData("C 2b Přikázaný směr jízdy vpravo", 		"img/c2b.png");
		SignEntries[EmplaceEntry()].SetData("C 2c Přikázaný směr jízdy vlevo", 			"img/c2c.png");
		SignEntries[EmplaceEntry()].SetData("C 2d Přikázaný směr jízdy přímo a vpravo", "img/c2d.png");
		SignEntries[EmplaceEntry()].SetData("C 2e Přikázaný směr jízdy přímo a vlevo", 	"img/c2e.png");
		SignEntries[EmplaceEntry()].SetData("C 2f Přikázaný směr jízdy vpravo a vlevo", "img/c2f.png");
		SignEntries[EmplaceEntry()].SetData("C 3a Přikázaný směr jízdy zde vpravo", 	"img/c3a.png");
		SignEntries[EmplaceEntry()].SetData("C 3b Přikázaný směr jízdy zde vlevo", 		"img/c3b.png");
		SignEntries[EmplaceEntry()].SetData("C 4a Přikázaný směr objíždění vpravo", 	"img/c4a.png");
		SignEntries[EmplaceEntry()].SetData("C 4a Přikázaný směr objíždění vpravo", 	"img/c4az.png");
		SignEntries[EmplaceEntry()].SetData("C 4b Přikázaný směr objíždění vlevo", 		"img/c4b.png");
		SignEntries[EmplaceEntry()].SetData("C 4c Přikázaný směr objíždění vpravo a vlevo", "img/c4c.png");
		SignEntries[EmplaceEntry()].SetData("C 7a Stezka pro chodce", 					"img/c7a.png");
		SignEntries[EmplaceEntry()].SetData("C 7b Konec stezky pro chodce", 			"img/c7b.png");
		SignEntries[EmplaceEntry()].SetData("C 8a Stezka pro cyklisty", 				"img/c8a.png");
		SignEntries[EmplaceEntry()].SetData("C 8b Konec stezky pro cyklisty", 			"img/c8b.png");
		SignEntries[EmplaceEntry()].SetData("C 9a Stezka pro chodce a cyklisty společná", 		"img/c9a.png");
		SignEntries[EmplaceEntry()].SetData("C 9b Konec stezky pro chodce a cyklisty společné", "img/c9b.png");
		SignEntries[EmplaceEntry()].SetData("C 10a Stezka pro chodce a cyklisty dělená", 		"img/c10a.png");
		SignEntries[EmplaceEntry()].SetData("C 10b Konec stezky pro chodce a cyklisty dělené", 	"img/c10b.png");
		SignEntries[EmplaceEntry()].SetData("C 14a Jiný příkaz", 						"img/c14a.png");
		SignEntries[EmplaceEntry()].SetData("C 14b Konec jiného příkazu", 				"img/c14b.png");
	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("PŘÍKAZOVÉ");
	}
};