## IMPORTANT TIP

The code is **outdated**.
If you are intrested in how the game works now, please refer to [the simulate tool](https://github.com/frto027/IsaacBagOfCraftingHuijiGadget) or [the search tool](https://github.com/frto027/IsaacDecraftingHuijiGadget) to get the latest disassembled code.

These tools can't be run directly, but a page in the BOI Chinese wiki([the simulate tool here](https://isaac.huijiwiki.com/wiki/%E6%A8%A1%E6%9D%BF:Crafting) and [the search tool here](https://isaac.huijiwiki.com/wiki/Decrafting)).

[the simulate tool](https://github.com/frto027/IsaacBagOfCraftingHuijiGadget) has the latest algorithm (version 1.7.9b or maybe newer if the game updates).

[the search tool](https://github.com/frto027/IsaacDecraftingHuijiGadget) use the algorithm to search every recipes.
it also contains the same algorithm in `C++ language`, which is compiled by `WebAssembly` toolchains. The C++ version is very fast, on my computer it only took 45 seconds to search all the recipes, which is nearly impossible in JavaScript.
you can find the latest algorithm in [the decrafting app's `get_result` function](https://github.com/frto027/IsaacDecraftingHuijiGadget/blob/master/src/App.vue), or [the cpp source](https://github.com/frto027/IsaacDecraftingHuijiGadget/blob/master/bofwasm/main.cpp).
