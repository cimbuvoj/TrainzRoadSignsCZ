/// ============================================
/// @file   dz_upravujici_prednost.gs
/// @author Vojtech Cimbura
/// ============================================

include "dz_base.gs"

/// @brief Czech road signs, category "Dopravní značky upravující přednost"
class DZUpravujiciPrednost isclass DZBase
{
	/// @brief Called when this object enters the scene ('Constructor')
	void Init()
	{
		inherited();

		SignEntries[EmplaceEntry()].SetData("P 1 Křižovatka s vedlejší pozemní komunikací", "img/p1.png", RSUtils.INPUT_LowerClip);
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
		
	/// @brief Construct HTML for the Trainz Property window of this object
	/// @detail Called by Trainz when the HTML property windows should be summoned
	/// @return HTML as a string
	public string GetDescriptionHTML()
	{
		return CreateHTML("UPRAVUJÍCÍ PŘEDNOST");
	}
};