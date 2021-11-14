"use strict"
//it is not done...
//disassembly from Game

function seed2str(seed){
    if(seed.length != 9)
        return 0
    //"xxxx xxxx"
    if(seed[4] != ' '){
        return 0
    }

    let dict = []
    for(let i=0;i<255;i++){
        dict[i] = 0xFF
    }
    for(let i=0;i<32;i++){
        dict["ABCDEFGHJKLMNPQRSTWXYZ01234V6789".charCodeAt(i)]=i
    }

    let num_seed = []
    for(let i=0;i<9;i++){
        if(i == 4)
            continue
        let j = i
        if(i > 4){
            j = i-1
        }
        num_seed[j] = dict[seed.charCodeAt(i)]
        if(num_seed[j] == 0xFF)
            return 0
    }

    let v8 = 0;
    let v10

    //num_seed[x] j is unsigned int8
    for (let j = ((num_seed[6] >>> 3) | (4
                                    * (num_seed[5] | (32
                                                    * (num_seed[4] | (32
                                                                    * (num_seed[3] | (32
                                                                                    * (num_seed[2] | (32 * (num_seed[1] | (32 * num_seed[0])))))))))))) ^ 0xFEF7FFD;
        j != 0;
        v8 = ((v10 >>> 7) + 2 * v10) & 0xFF)
    {
        v10 = ((j & 0xFF) + v8) & 0xFF;
        j >>>= 5;
    }
    if ( v8 == (num_seed[7] | (0xFF & (32 * num_seed[6])))){
        return ((num_seed[6] >> 3) | (4
            * (num_seed[5] | (32
                            * (num_seed[4] | (32
                                            * (num_seed[3] | (32
                                                                    * (num_seed[2] | (32 * (num_seed[1] | (32 * num_seed[0])))))))))))) ^ 0xFEF7FFD;
    }
    return 0
}
console.assert(seed2str('JKD9 Z0C9') == 1302889765)


function bucket_sort_list_toint64(item_array){
    //对item_array进行桶排序
    console.assert(item_array.length == 8)

    let item_count = []

    //initial value
    for(let i=0;i<0x1F;i++){
        item_count[i] = 0
    }

    item_count[item_array[0]]++
    item_count[item_array[1]]++
    item_count[item_array[2]]++
    item_count[item_array[3]]++
    item_count[item_array[4]]++
    item_count[item_array[5]]++
    item_count[item_array[6]]++
    item_count[item_array[7]]++

    let offset = 0n

    
    let v12 = 0n // v12 is 64 bit
    for(let i=0n;i<0x1Fn;i++){
        for(let j=0;j<item_count[i];j++){
            //此代码一定会执行8遍
            v12 |= i << offset
            offset += 8n
        }
    }
    //v12 = 0x08 07 06 05 04 03 02 01
    return v12
}

console.assert(bucket_sort_list_toint64([0x16n,0x2n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n]) == 0x1616161616161602n)

// ===== begin BTree search =====
let btree_nodes = {
    "0B73A168":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C805818", over:true},
    "1C7FDE60":{left:"0B73A168", upper:"1C7FDE98", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x2Dn},
    "1C7FDE28":{left:"1C7FDE98", upper:"0B73A168", right:"1C7FE160", over:false, input:0x0808080808080808n,output:0xB1n},
    "1C805818":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1D1D1D1D1D1D1D1Dn,output:0x24n},
    "1C7FDE98":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C7FD3F8", over:false, input:0x0202020202020202n,output:0x2AEn},
    "1C7FE160":{left:"1C7FE128", upper:"1C7FDE28", right:"1C7FD430", over:false, input:0x1515151515151515n,output:0x55n},
    "1C7FD5F0":{left:"1C7FD5B8", upper:"1C7FD430", right:"1C805818", over:false, input:0x1919191919191919n,output:0x244n},
    "1C7FD3F8":{left:"1C7FE0B8", upper:"1C7FDE98", right:"1C7FD580", over:false, input:0x0404040404040404n,output:0xB6n},
    "1C7FE128":{left:"1C7FE0F0", upper:"1C7FE160", right:"1C7FD510", over:false, input:0x0F0F0F0F0F0F0F0Fn,output:0x25n},
    "1C7FD430":{left:"1C7FD468", upper:"1C7FE160", right:"1C7FD5F0", over:false, input:0x1616161616161616n,output:0x4Bn},
    "1C7FD5B8":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1818181818181818n,output:0x1E9n},
    "1C7FE0B8":{left:"0B73A168", upper:"1C7FD3F8", right:"0B73A168", over:false, input:0x0303030303030303n,output:0x76n},
    "1C7FD580":{left:"1C7FD3C0", upper:"1C7FD3F8", right:"1C7FD4A0", over:false, input:0x0606060606060606n,output:0x274n},
    "1C7FE0F0":{left:"0B73A168", upper:"1C7FE128", right:"1C7FD4D8", over:false, input:0x0C0C0C0C0C0C0C0Cn,output:0x157n},
    "1C7FD510":{left:"1C7FD548", upper:"1C7FE128", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x1E3n},
    "1C7FD468":{left:"0B73A168", upper:"1C7FD430", right:"0B73A168", over:false, input:0x1616161616161603n,output:0x28En},
    "1C7FD3C0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0504040404040201n,output:0x14Bn},
    "1C7FD4A0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0707010101010101n,output:0x27Fn},
    "1C7FD4D8":{left:"0B73A168", upper:"1C7FE0F0", right:"0B73A168", over:false, input:0x0D0D0C0C0C0C0C0Cn,output:0xAFn},
    "1C7FD548":{left:"0B73A168", upper:"1C7FD510", right:"0B73A168", over:false, input:0x10100F0F0F0F0F0F,output:0x1E3n},
}

for(let address in btree_nodes){
    let node = btree_nodes[address]
    console.assert(btree_nodes[node.left], node.left)
    console.assert(btree_nodes[node.upper], node.upper)
    console.assert(btree_nodes[node.right], node.right)
    // node.address = address
}

let btree = btree_nodes["0B73A168"]
function binary_tree_search_element(sorted_items){
    console.assert(typeof sorted_items == 'bigint')
    let root = btree_nodes[btree.upper]

    let output = {
        node:root,
        finded:false,
        found_node:btree
    }

    while(!root.over){
        output.node = root
        if(root.input >= sorted_items){
            output.found_node = root
            output.finded = 1
            root = btree_nodes[root.left]
        }else{
            root = btree_nodes[root.right]
            output.finded = 0
        }
    }
    return output
}

console.assert(binary_tree_search_element(0x1616161616161616n).found_node.input == 0x1616161616161616n)
//===== end BTree search


//========== test a combine ===========

let rng_offsets = [
    0x00000001n, 0x00000005n, 0x00000010n, 0x00000001n, 0x00000005n, 0x00000013n, 0x00000001n, 0x00000009n,
    0x0000001Dn, 0x00000001n, 0x0000000Bn, 0x00000006n, 0x00000001n, 0x0000000Bn, 0x00000010n, 0x00000001n,
    0x00000013n, 0x00000003n, 0x00000001n, 0x00000015n, 0x00000014n, 0x00000001n, 0x0000001Bn, 0x0000001Bn,
    0x00000002n, 0x00000005n, 0x0000000Fn, 0x00000002n, 0x00000005n, 0x00000015n, 0x00000002n, 0x00000007n,
    0x00000007n, 0x00000002n, 0x00000007n, 0x00000009n, 0x00000002n, 0x00000007n, 0x00000019n, 0x00000002n,
    0x00000009n, 0x0000000Fn, 0x00000002n, 0x0000000Fn, 0x00000011n, 0x00000002n, 0x0000000Fn, 0x00000019n,
    0x00000002n, 0x00000015n, 0x00000009n, 0x00000003n, 0x00000001n, 0x0000000En, 0x00000003n, 0x00000003n,
    0x0000001An, 0x00000003n, 0x00000003n, 0x0000001Cn, 0x00000003n, 0x00000003n, 0x0000001Dn, 0x00000003n,
    0x00000005n, 0x00000014n, 0x00000003n, 0x00000005n, 0x00000016n, 0x00000003n, 0x00000005n, 0x00000019n,
    0x00000003n, 0x00000007n, 0x0000001Dn, 0x00000003n, 0x0000000Dn, 0x00000007n, 0x00000003n, 0x00000017n,
    0x00000019n, 0x00000003n, 0x00000019n, 0x00000018n, 0x00000003n, 0x0000001Bn, 0x0000000Bn, 0x00000004n,
    0x00000003n, 0x00000011n, 0x00000004n, 0x00000003n, 0x0000001Bn, 0x00000004n, 0x00000005n, 0x0000000Fn,
    0x00000005n, 0x00000003n, 0x00000015n, 0x00000005n, 0x00000007n, 0x00000016n, 0x00000005n, 0x00000009n,
    0x00000007n, 0x00000005n, 0x00000009n, 0x0000001Cn, 0x00000005n, 0x00000009n, 0x0000001Fn, 0x00000005n,
    0x0000000Dn, 0x00000006n, 0x00000005n, 0x0000000Fn, 0x00000011n, 0x00000005n, 0x00000011n, 0x0000000Dn,
    0x00000005n, 0x00000015n, 0x0000000Cn, 0x00000005n, 0x0000001Bn, 0x00000008n, 0x00000005n, 0x0000001Bn,
    0x00000015n, 0x00000005n, 0x0000001Bn, 0x00000019n, 0x00000005n, 0x0000001Bn, 0x0000001Cn, 0x00000006n,
    0x00000001n, 0x0000000Bn, 0x00000006n, 0x00000003n, 0x00000011n, 0x00000006n, 0x00000011n, 0x00000009n,
    0x00000006n, 0x00000015n, 0x00000007n, 0x00000006n, 0x00000015n, 0x0000000Dn, 0x00000007n, 0x00000001n,
    0x00000009n, 0x00000007n, 0x00000001n, 0x00000012n, 0x00000007n, 0x00000001n, 0x00000019n, 0x00000007n,
    0x0000000Dn, 0x00000019n, 0x00000007n, 0x00000011n, 0x00000015n, 0x00000007n, 0x00000019n, 0x0000000Cn,
    0x00000007n, 0x00000019n, 0x00000014n, 0x00000008n, 0x00000007n, 0x00000017n, 0x00000008n, 0x00000009n,
    0x00000017n, 0x00000009n, 0x00000005n, 0x0000000En, 0x00000009n, 0x00000005n, 0x00000019n, 0x00000009n,
    0x0000000Bn, 0x00000013n, 0x00000009n, 0x00000015n, 0x00000010n, 0x0000000An, 0x00000009n, 0x00000015n,
    0x0000000An, 0x00000009n, 0x00000019n, 0x0000000Bn, 0x00000007n, 0x0000000Cn, 0x0000000Bn, 0x00000007n,
    0x00000010n, 0x0000000Bn, 0x00000011n, 0x0000000Dn, 0x0000000Bn, 0x00000015n, 0x0000000Dn, 0x0000000Cn,
    0x00000009n, 0x00000017n, 0x0000000Dn, 0x00000003n, 0x00000011n, 0x0000000Dn, 0x00000003n, 0x0000001Bn,
    0x0000000Dn, 0x00000005n, 0x00000013n, 0x0000000Dn, 0x00000011n, 0x0000000Fn, 0x0000000En, 0x00000001n,
    0x0000000Fn, 0x0000000En, 0x0000000Dn, 0x0000000Fn, 0x0000000Fn, 0x00000001n, 0x0000001Dn, 0x00000011n,
    0x0000000Fn, 0x00000014n, 0x00000011n, 0x0000000Fn, 0x00000017n, 0x00000011n, 0x0000000Fn, 0x0000001An]

function RNG_Next(num, offset_id){
    let offset_a = rng_offsets[offset_id * 3]
    let offset_b = rng_offsets[offset_id * 3 + 1]
    let offset_c = rng_offsets[offset_id * 3 + 2]
    num = num ^ ((num >> offset_a) & 0xFFFFFFFFn)
    num = num ^ ((num << offset_b) & 0xFFFFFFFFn)
    num = num ^ ((num >> offset_c) & 0xFFFFFFFFn)
    return num
}


var {item_pool_data, item_config_data} = require('./datas')


function GetItemPoolData(item_pool_id){
    console.assert(item_pool_data[item_pool_id] != undefined)
    return item_pool_data[item_pool_id]
}
function GetItemConfig(item_id){
    console.assert(item_config_data[item_id] != undefined)
    return item_config_data[item_id]
}
function GetAchievementUnlocked(achievement_id){
    if(achievement_id >= 0x27E)
        return false
    if(achievement_id == 0n)
        return true
        
    if(false /* xxxx */)
        return true

    // I dont know what it is, maybe daily run
    // if( cond1 == 2 && (cond2.x || cond2.y))
    //     return true
    return false
}

function get_result(input_array, gameStartSeed){
    if(typeof gameStartSeed == 'number')
        gameStartSeed = BigInt(gameStartSeed)
    console.assert(typeof gameStartSeed == 'bigint')

    let sorted_items = bucket_sort_list_toint64(input_array)


    let search_result = binary_tree_search_element(sorted_items).found_node
    if(search_result.over || sorted_items < search_result.input){
        search_result = btree
    }
    if(search_result == btree || search_result.output == 0){
        //you can use this BSearch algorithm from game, or just scan recipes.xml 

        //总之就是没有查到固定组合
        //中间是一系列算法
        //GetBagOfCraftItemId L131
        let item_count = []
        for(let i=0;i<0x1F;i++){
            item_count[i] = 0
        }
        item_count[input_array[0]]++
        item_count[input_array[1]]++
        item_count[input_array[2]]++
        item_count[input_array[3]]++
        item_count[input_array[4]]++
        item_count[input_array[5]]++
        item_count[input_array[6]]++
        item_count[input_array[7]]++
        
        let score_matrix = [
            0x00000000, 0x00000001, 0x00000004, 0x00000005, 0x00000005, 0x00000005, 0x00000005,
            0x00000001, 0x00000001, 0x00000003, 0x00000005, 0x00000008, 0x00000002, 0x00000007, 
            0x00000005, 0x00000002, 0x00000007, 0x0000000A, 0x00000002, 0x00000004, 0x00000008, 
            0x00000002, 0x00000002, 0x00000004, 0x00000004, 0x00000002, 0x00000007, 0x00000007, 
            0x00000007, 0x00000000, 0x00000001]
        
        let item_score_sum = 
            score_matrix[input_array[0]] + 
            score_matrix[input_array[1]] + 
            score_matrix[input_array[2]] + 
            score_matrix[input_array[3]] + 
            score_matrix[input_array[4]] + 
            score_matrix[input_array[5]] + 
            score_matrix[input_array[6]] + 
            score_matrix[input_array[7]]

        // console.log("item score sum = " + item_score_sum)
        let weight_list = [
            {id:0,weight:1.0},
            {id:1,weight:2.0},
            {id:2,weight:2.0},
            {id:4,weight:item_count[4] * 10.0},
            {id:3,weight:item_count[3] * 10.0},
            {id:5,weight:item_count[6] * 5.0},
            {id:8,weight:item_count[5] * 10.0},
            {id:12,weight:item_count[7] * 10.0},
            {id:9,weight:item_count[25] * 10.0},
            {id:7,weight:item_count[29] * 10.0},
        ]
        if(item_count[15] + item_count[12] + item_count[8] + item_count[1] == 0){
            weight_list.push(
                {id:26, weight:item_count[23] * 10.0}
            )
        }
        if(gameStartSeed == 0n){
            throw "Error"
        }

        let currentSeed = gameStartSeed

        for(let item_i = 0;item_i < 0x1F;item_i++){
            for(let j=0;j<item_count[item_i];j++){
                currentSeed = RNG_Next(currentSeed, item_i)
            }
        }
        // console.log(currentSeed)
        let collectible_count = 733 // it equals to some_variable_a - some_variable_b
        
        let collectible_list = []
        for(let i=0;i<collectible_count;i++){
            collectible_list[i] = 0.0
        }

        let all_weight = 0.0
        // console.log(weight_list)
        if(weight_list.length > 0){
            for(let weight_select_i = 0;weight_select_i < weight_list.length;weight_select_i++){
                if(weight_list[weight_select_i].weight <= 0.0){
                    continue
                }
                let score = item_score_sum
                if(weight_list[weight_select_i].id == 4 || weight_list[weight_select_i].id == 3 || weight_list[weight_select_i].id == 5){
                    score -= 5
                }

                let quality_min = 0
                let quality_max = 1
                if ( score > 34 )
                {
                    quality_max = 4;
                    quality_min = 4;
                }
                else if ( score > 30 )
                {
                    quality_max = 4;
                    quality_min = 3;
                }
                else if ( score > 26 )
                {
                    quality_max = 4;
                    quality_min = 3;
                }
                else if ( score > 22 )
                {
                    quality_max = 4;
                    quality_min = 2;
                }
                else if ( score > 18 )
                {
                    quality_max = 3;
                    quality_min = 2;
                }
                else if ( score > 14 )
                {
                    quality_min = 1;
                    quality_max = 2;
                }else if ( score > 8 )
                {
                    quality_min = 0;
                    quality_max = 2;
                }
                
                let item_pools = GetItemPoolData(weight_list[weight_select_i].id)
                for(let item_pool_i = 0;item_pool_i < item_pools.length;item_pool_i++){
                    // if(some_address == 0){//v53, dword_1779AEC
                    //     //not handled
                    //     //i dont know
                    // }
                    let item_config = undefined
                    if(item_pools[item_pool_i].id >= 0){
                        if(item_pools[item_pool_i].id >= collectible_count){
                            item_config = undefined
                        }else{
                            item_config = GetItemConfig(item_pools[item_pool_i].id)
                        }
                        //goto label 86
                    }else{
                        //what's wrong with item ID?
                        //i dont know if it is right...
                        console.assert(false, "Unknown condition")
                        let tempid = ~item_pools[item_pool_i].id
                        if(tempid < 0 || tempid > collectible_count /* it is not collectible_count, i dont know what it is */)
                        {
                            item_config = undefined  
                        }else{
                            item_config = GetItemConfig(tempid) /* it is not ItemConfig, i dont know what it is */
                        }
                    }

                    let item_quality = 0 + item_config.quality /* there is not a zero, but a var from item_config, which is always zero when i'm testing */
                    if(item_quality >= quality_min && item_quality <= quality_max){
                        //be careful:the game use float instead of double, so js in not accurate!!!
                        let item_weight = item_pools[item_pool_i].weight * weight_list[weight_select_i].weight
                        all_weight += item_weight
                        // console.log(all_weight)
                        collectible_list[item_pools[item_pool_i].id] += item_weight
                    }
                }
            }
            //label 92
            //for break condition, nothing to do here
        }
        //all weight is not accurate
        // console.log("all weight = " + all_weight)

        // console.log("current seed = " + currentSeed)

        let retry_count = 0

        let selected

        while(true){
            currentSeed = RNG_Next(currentSeed,6)
            //use float instead!!!
            let remains = Number(currentSeed) * 2.3283062e-10 * all_weight
            // console.log(remains)
            selected = 25
            for(let current_select=0;current_select < collectible_count;current_select++){
                // console.log(collectible_list[current_select])
                if(collectible_list[current_select] > remains){
                    selected = current_select
                    break
                }
                remains -= collectible_list[current_select]
            }
            // console.log(selected)
            
            // if(something == null){ dword_1779AEC
            //     break
            // }

            if(selected >= 0){
                //label 109
                if(selected >= collectible_count){
                    //goto label 120
                }
            }else{
                console.assert(false, "not tested")
                //v72 be careful
            }
            
            // if(v72) yes, sure, v72 = something[select]
            let item_config = GetItemConfig(selected)
            console.log(item_config)
            if(item_config != undefined && 
                (
                    item_config.achievement_id == undefined ||
                    GetAchievementUnlocked(item_config.achievement_id)
                )
            ){
                break
            }
            if(++retry_count >= 20)
                break
        }
        return selected
    }
    return Number(search_result.output)
}

let input_array = [0x8n,0x2n,0x16n,0xcn,8n,8n,9n,0xfn] //[0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x1n]
console.log(get_result(input_array, seed2str('JKD9 Z0C9')))
