// =================================
// dz_vystrazne.gs
// Author: Vojtech Cimbura, 2025
// =================================

include "dz_base.gs"

class DZVystrazne isclass DZBase
{
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("A 1a Zatáčka vpravo", 					"img/a1a.png");
		SignEntries[EmplaceEntry()].SetData("A 1b Zatáčka vlevo", 					"img/a1b.png");
		SignEntries[EmplaceEntry()].SetData("A 2a Dvojitá zatáčka, první vpravo", 	"img/a2a.png");
		SignEntries[EmplaceEntry()].SetData("A 2b Dvojitá zatáčka, první vlevo", 	"img/a2b.png");
		SignEntries[EmplaceEntry()].SetData("A 3 Křižovatka", 						"img/a3.png");
		SignEntries[EmplaceEntry()].SetData("A 3 Křižovatka", 						"img/a3z.png");
		SignEntries[EmplaceEntry()].SetData("A 4 Křižovatka s kruhovým objezdem", 	"img/a4.png");
		SignEntries[EmplaceEntry()].SetData("A 5a Nebezpečné klesání", 				"img/a5a.png");
		SignEntries[EmplaceEntry()].SetData("A 5b Nebezpečné stoupání", 			"img/a5b.png");
		SignEntries[EmplaceEntry()].SetData("A 6a Zúžená vozovka (z obou stran)", 	"img/a6a.png");
		SignEntries[EmplaceEntry()].SetData("A 6b Zúžená vozovka (z jedné strany)", "img/a6b.png");
		SignEntries[EmplaceEntry()].SetData("A 7a Nerovnost vozovky", 				"img/a7a.png");
		SignEntries[EmplaceEntry()].SetData("A 10 Světelné signály", 				"img/a10.png");
		SignEntries[EmplaceEntry()].SetData("A 11 Přechod pro chodce", 				"img/a11.png");
		SignEntries[EmplaceEntry()].SetData("A 11 Přechod pro chodce", 				"img/a11z.png");
		SignEntries[EmplaceEntry()].SetData("A 12a Chodci", 						"img/a12a.png");
		SignEntries[EmplaceEntry()].SetData("A 12a Chodci", 						"img/a12az.png");
		SignEntries[EmplaceEntry()].SetData("A 12b Děti", 							"img/a12b.png");
		SignEntries[EmplaceEntry()].SetData("A 12b Děti", 							"img/a12bz.png");
		SignEntries[EmplaceEntry()].SetData("A 15 Práce na silnici", 				"img/a15.png");
		SignEntries[EmplaceEntry()].SetData("A 15 Práce na silnici", 				"img/a15z.png");
		SignEntries[EmplaceEntry()].SetData("A 21 Tunel", 							"img/a21.png");
		SignEntries[EmplaceEntry()].SetData("A 22 Jiné nebezpečí", 					"img/a22.png");
		SignEntries[EmplaceEntry()].SetData("A 25 Tramvaj", 						"img/a25.png");
		SignEntries[EmplaceEntry()].SetData("A 29 Železniční přejezd se závorami", 	"img/a29.png");
		SignEntries[EmplaceEntry()].SetData("A 30 Železniční přejezd bez závor", 	"img/a30.png");
	}
	
	public string GetDescriptionHTML()
	{
		return CreateHTML("VÝSTRAŽNÉ");
	}
};