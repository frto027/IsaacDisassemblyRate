## IMPORTANT TIP

The code is **outdated**.
If you are intrested in how the game works now, please refer to [the simulate tool](https://github.com/frto027/IsaacBagOfCraftingHuijiGadget) or the [search tool](https://github.com/frto027/IsaacDecraftingHuijiGadget) to get the latest disassembled code.

These tools can't be run directly, but a page in the BOI Chinese wiki([here](https://isaac.huijiwiki.com/wiki/%E6%A8%A1%E6%9D%BF:Crafting) and [here](https://isaac.huijiwiki.com/wiki/Decrafting)).

[the simulate tool](https://github.com/frto027/IsaacBagOfCraftingHuijiGadget) has the latest algorithm (version 1.7.9b or maybe newer if the game updates).

[search tool](https://github.com/frto027/IsaacDecraftingHuijiGadget) use the algorithm to search every recipes.
it also contains the same algorithm in `C++ language`, which is compiled by `WebAssembly` toolchains.
you can find the latest algorithm in [the decrafting app's `get_result` function](https://github.com/frto027/IsaacDecraftingHuijiGadget/blob/master/src/App.vue), or [the cpp source](https://github.com/frto027/IsaacDecraftingHuijiGadget/blob/master/bofwasm/main.cpp).
