/// ============================================
/// @file   dz_dodatkove.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "DOdatkové dopravní značky"
class DZDodatkove isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("E 1 Počet", 						"img/e1.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int, 4, 2, 9);
		SignEntries[EmplaceEntry()].SetData("E 2a Tvar křižovatky", 			"img/e2a.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int | RSUtils.INPUT_OptionCycle, 0, 0, 3); // Rotation index
		SignEntries[EmplaceEntry()].SetData("E 2b Tvar křižovatky", 			"img/e2b.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int | RSUtils.INPUT_OptionCycle, 0, 0, 3); // Rotation index
		SignEntries[EmplaceEntry()].SetData("E 3a Vzdálenost", 					"img/e3a.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int, 1500, 10, 5000);
		SignEntries[EmplaceEntry()].SetData("E 4 Délka úseku", 					"img/e4.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int, 2, 1, 90);
		SignEntries[EmplaceEntry()].SetData("E 5 Největší povolená hmotnost", 	"img/e5.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Float, 3.5);
		SignEntries[EmplaceEntry()].SetData("E 6 Za mokra (za deště)", 			"img/e6.png",	RSUtils.INPUT_NoPole);
		SignEntries[EmplaceEntry()].SetData("E 7b Směrová šipka pro odbočení", 	"img/e7b.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int | RSUtils.INPUT_OptionCycle, 0, 0, 1); // Left or right
		SignEntries[EmplaceEntry()].SetData("E 8a Začátek úseku", 				"img/e8a.png",  RSUtils.INPUT_NoPole);
		SignEntries[EmplaceEntry()].SetData("E 8b Průbeh úseku", 				"img/e8b.png",  RSUtils.INPUT_NoPole);
		SignEntries[EmplaceEntry()].SetData("E 8c Konec úseku", 				"img/e8c.png",  RSUtils.INPUT_NoPole);
		SignEntries[EmplaceEntry()].SetData("E 9 Druh vozidla", 				"img/e9.png",	RSUtils.INPUT_NoPole | RSUtils.INPUT_Int | RSUtils.INPUT_OptionCycle, 0, 0, 3); // Type of vehicle index
		SignEntries[EmplaceEntry()].SetData("E 13 Text nebo symbol", 			"img/e13.png", 	RSUtils.INPUT_NoPole | RSUtils.INPUT_String, "MIMO ZÁSOBOVÁNÍ");
	}
	
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("DODATKOVÉ");
	}
};