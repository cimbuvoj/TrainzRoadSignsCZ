/// ============================================
/// @file   dz_vystrazne.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "Výstražné dopravní značky"
class DZVystrazne isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("A 1a Zatáčka vpravo", 					"img/a1a.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 1b Zatáčka vlevo", 					"img/a1b.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 2a Dvojitá zatáčka, první vpravo", 	"img/a2a.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 2b Dvojitá zatáčka, první vlevo", 	"img/a2b.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 3 Křižovatka", 						"img/a3.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 4 Křižovatka s kruhovým objezdem", 	"img/a4.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 5a Nebezpečné klesání", 				"img/a5a.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 5b Nebezpečné stoupání", 			"img/a5b.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 6a Zúžená vozovka (z obou stran)", 	"img/a6a.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 6b Zúžená vozovka (z jedné strany)", "img/a6b.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 7a Nerovnost vozovky", 				"img/a7a.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 10 Světelné signály", 				"img/a10.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 11 Přechod pro chodce", 				"img/a11.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 11 Přechod pro chodce", 				"img/a11z.png");
		SignEntries[EmplaceEntry()].SetData("A 12a Chodci", 						"img/a12a.png", RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 12a Chodci", 						"img/a12az.png");
		SignEntries[EmplaceEntry()].SetData("A 12b Děti", 							"img/a12b.png", RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 12b Děti", 							"img/a12bz.png");
		SignEntries[EmplaceEntry()].SetData("A 14 Zvěř", 							"img/a14.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 15 Práce na silnici", 				"img/a15.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 15 Práce na silnici", 				"img/a15z.png");
		SignEntries[EmplaceEntry()].SetData("A 21 Tunel", 							"img/a21.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 22 Jiné nebezpečí", 					"img/a22.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 25 Tramvaj", 						"img/a25.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 29 Železniční přejezd se závorami", 	"img/a29.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 30 Železniční přejezd bez závor", 	"img/a30.png", 	RSUtils.INPUT_LowerClip);
		SignEntries[EmplaceEntry()].SetData("A 31a Návěstní deska (240 m)",			"img/a31a.png", RSUtils.INPUT_Pole230cm);
		SignEntries[EmplaceEntry()].SetData("A 31b Návěstní deska (160 m)",			"img/a31b.png", RSUtils.INPUT_Pole230cm);
		SignEntries[EmplaceEntry()].SetData("A 31c Návěstní deska (80 m)",			"img/a31c.png", RSUtils.INPUT_Pole230cm);
	}
	
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("VÝSTRAŽNÉ");
	}
};