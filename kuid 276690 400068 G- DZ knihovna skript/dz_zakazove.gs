/// ============================================
/// @file   dz_zakazove.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "Zákazové dopravní značky"
class DZZakazove isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("B 1 Zákaz vjezdu všech vozidel (v obou směrech)", 										"img/B1.png");
		SignEntries[EmplaceEntry()].SetData("B 2 Zákaz vjezdu všech vozidel", 														"img/b2.png");
		SignEntries[EmplaceEntry()].SetData("B 3 Zákaz vjezdu všech motorových vozidel s výjimkou motocyklů bez postranního vozíku","img/b3.png");
		SignEntries[EmplaceEntry()].SetData("B 4 Zákaz vjezdu nákladních automobilů", 												"img/b4.png");
		SignEntries[EmplaceEntry()].SetData("B 8 Zákaz vjezdu jízdních kol", 														"img/b8.png");
		SignEntries[EmplaceEntry()].SetData("B 11 Zákaz vjezdu všech motorových vozidel", 											"img/b11.png");
		SignEntries[EmplaceEntry()].SetData("B 13 Zákaz vjezdu vozidel, jejichž okamžitá hmotnost přesahuje vyznačenou mez", 		"img/b13.png", 	RSUtils.INPUT_Float, 6);
		SignEntries[EmplaceEntry()].SetData("B 15 Zákaz vjezdu vozidel, jejichž šířka přesahuje vyznačenou mez", 					"img/b15.png", 	RSUtils.INPUT_Float, 2.5);
		SignEntries[EmplaceEntry()].SetData("B 16 Zákaz vjezdu vozidel, jejichž výška přesahuje vyznačenou mez", 					"img/b16.png", 	RSUtils.INPUT_Float, 3.5);
		SignEntries[EmplaceEntry()].SetData("B 20a Nejvyšší dovolená rychlost", 													"img/b20a.png",	RSUtils.INPUT_Int, 80, 30, 130);
		SignEntries[EmplaceEntry()].SetData("B 20a Nejvyšší dovolená rychlost", 													"img/b20az.png",RSUtils.INPUT_Int, 80, 30, 130);
		SignEntries[EmplaceEntry()].SetData("B 20b Konec nejvyšší dovolené rychlosti", 												"img/b20b.png", RSUtils.INPUT_Int, 80, 30, 130);
		SignEntries[EmplaceEntry()].SetData("B 21a Zákaz předjíždění", 																"img/b21a.png");
		SignEntries[EmplaceEntry()].SetData("B 21b Konec zákazu předjíždění", 														"img/b21b.png");
		SignEntries[EmplaceEntry()].SetData("B 22a Zákaz předjíždění pro nákladní automobily", 										"img/b22a.png");
		SignEntries[EmplaceEntry()].SetData("B 22b Konec zákazu předjíždění pro nákladní automobily", 								"img/b22b.png");
		SignEntries[EmplaceEntry()].SetData("B 24a Zákaz odbočování vpravo", 														"img/b24a.png");
		SignEntries[EmplaceEntry()].SetData("B 24b Zákaz odbočování vlevo", 														"img/b24b.png");
		SignEntries[EmplaceEntry()].SetData("B 25 Zákaz otáčení", 																	"img/b25.png");
		SignEntries[EmplaceEntry()].SetData("B 26 Konec všech zákazů", 																"img/b26.png");
		SignEntries[EmplaceEntry()].SetData("B 28 Zákaz zastavení", 																"img/b28.png");
		SignEntries[EmplaceEntry()].SetData("B 29 Zákaz stání", 																	"img/b29.png");
		SignEntries[EmplaceEntry()].SetData("B 30 Zákaz vstupu chodců", 															"img/b30.png");
		SignEntries[EmplaceEntry()].SetData("B 32 Jiný zákaz - Průjezd zakázán",													"img/b32b.png");
	}
	
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("ZÁKAZOVÉ");
	}
};