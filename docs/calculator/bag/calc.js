"use strict"
//disassembly from Game

function str2seed(seed){
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
console.assert(str2seed('JKD9 Z0C9') == 1302889765)


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

console.assert(bucket_sort_list_toint64([0x16,0x2,0x16,0x16,0x16,0x16,0x16,0x16]) == 0x1616161616161602n)

// ===== begin BTree search =====
let btree_nodes = {
    "0B73A168":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C805818", over:true},
    "1C7FDE60":{left:"0B73A168", upper:"1C7FDE98", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x2D},
    "1C7FDE28":{left:"1C7FDE98", upper:"0B73A168", right:"1C7FE160", over:false, input:0x0808080808080808n,output:0xB1},
    "1C805818":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1D1D1D1D1D1D1D1Dn,output:0x24},
    "1C7FDE98":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C7FD3F8", over:false, input:0x0202020202020202n,output:0x2AE},
    "1C7FE160":{left:"1C7FE128", upper:"1C7FDE28", right:"1C7FD430", over:false, input:0x1515151515151515n,output:0x55},
    "1C7FD5F0":{left:"1C7FD5B8", upper:"1C7FD430", right:"1C805818", over:false, input:0x1919191919191919n,output:0x244},
    "1C7FD3F8":{left:"1C7FE0B8", upper:"1C7FDE98", right:"1C7FD580", over:false, input:0x0404040404040404n,output:0xB6},
    "1C7FE128":{left:"1C7FE0F0", upper:"1C7FE160", right:"1C7FD510", over:false, input:0x0F0F0F0F0F0F0F0Fn,output:0x25},
    "1C7FD430":{left:"1C7FD468", upper:"1C7FE160", right:"1C7FD5F0", over:false, input:0x1616161616161616n,output:0x4B},
    "1C7FD5B8":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1818181818181818n,output:0x1E9},
    "1C7FE0B8":{left:"0B73A168", upper:"1C7FD3F8", right:"0B73A168", over:false, input:0x0303030303030303n,output:0x76},
    "1C7FD580":{left:"1C7FD3C0", upper:"1C7FD3F8", right:"1C7FD4A0", over:false, input:0x0606060606060606n,output:0x274},
    "1C7FE0F0":{left:"0B73A168", upper:"1C7FE128", right:"1C7FD4D8", over:false, input:0x0C0C0C0C0C0C0C0Cn,output:0x157},
    "1C7FD510":{left:"1C7FD548", upper:"1C7FE128", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x1E3},
    "1C7FD468":{left:"0B73A168", upper:"1C7FD430", right:"0B73A168", over:false, input:0x1616161616161603n,output:0x28E},
    "1C7FD3C0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0504040404040201n,output:0x14B},
    "1C7FD4A0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0707010101010101n,output:0x27F},
    "1C7FD4D8":{left:"0B73A168", upper:"1C7FE0F0", right:"0B73A168", over:false, input:0x0D0D0C0C0C0C0C0Cn,output:0xAF},
    "1C7FD548":{left:"0B73A168", upper:"1C7FD510", right:"0B73A168", over:false, input:0x10100F0F0F0F0F0Fn,output:0x1E3},
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
    0x00000001, 0x00000005, 0x00000010, 0x00000001, 0x00000005, 0x00000013, 0x00000001, 0x00000009,
    0x0000001D, 0x00000001, 0x0000000B, 0x00000006, 0x00000001, 0x0000000B, 0x00000010, 0x00000001,
    0x00000013, 0x00000003, 0x00000001, 0x00000015, 0x00000014, 0x00000001, 0x0000001B, 0x0000001B,
    0x00000002, 0x00000005, 0x0000000F, 0x00000002, 0x00000005, 0x00000015, 0x00000002, 0x00000007,
    0x00000007, 0x00000002, 0x00000007, 0x00000009, 0x00000002, 0x00000007, 0x00000019, 0x00000002,
    0x00000009, 0x0000000F, 0x00000002, 0x0000000F, 0x00000011, 0x00000002, 0x0000000F, 0x00000019,
    0x00000002, 0x00000015, 0x00000009, 0x00000003, 0x00000001, 0x0000000E, 0x00000003, 0x00000003,
    0x0000001A, 0x00000003, 0x00000003, 0x0000001C, 0x00000003, 0x00000003, 0x0000001D, 0x00000003,
    0x00000005, 0x00000014, 0x00000003, 0x00000005, 0x00000016, 0x00000003, 0x00000005, 0x00000019,
    0x00000003, 0x00000007, 0x0000001D, 0x00000003, 0x0000000D, 0x00000007, 0x00000003, 0x00000017,
    0x00000019, 0x00000003, 0x00000019, 0x00000018, 0x00000003, 0x0000001B, 0x0000000B, 0x00000004,
    0x00000003, 0x00000011, 0x00000004, 0x00000003, 0x0000001B, 0x00000004, 0x00000005, 0x0000000F,
    0x00000005, 0x00000003, 0x00000015, 0x00000005, 0x00000007, 0x00000016, 0x00000005, 0x00000009,
    0x00000007, 0x00000005, 0x00000009, 0x0000001C, 0x00000005, 0x00000009, 0x0000001F, 0x00000005,
    0x0000000D, 0x00000006, 0x00000005, 0x0000000F, 0x00000011, 0x00000005, 0x00000011, 0x0000000D,
    0x00000005, 0x00000015, 0x0000000C, 0x00000005, 0x0000001B, 0x00000008, 0x00000005, 0x0000001B,
    0x00000015, 0x00000005, 0x0000001B, 0x00000019, 0x00000005, 0x0000001B, 0x0000001C, 0x00000006,
    0x00000001, 0x0000000B, 0x00000006, 0x00000003, 0x00000011, 0x00000006, 0x00000011, 0x00000009,
    0x00000006, 0x00000015, 0x00000007, 0x00000006, 0x00000015, 0x0000000D, 0x00000007, 0x00000001,
    0x00000009, 0x00000007, 0x00000001, 0x00000012, 0x00000007, 0x00000001, 0x00000019, 0x00000007,
    0x0000000D, 0x00000019, 0x00000007, 0x00000011, 0x00000015, 0x00000007, 0x00000019, 0x0000000C,
    0x00000007, 0x00000019, 0x00000014, 0x00000008, 0x00000007, 0x00000017, 0x00000008, 0x00000009,
    0x00000017, 0x00000009, 0x00000005, 0x0000000E, 0x00000009, 0x00000005, 0x00000019, 0x00000009,
    0x0000000B, 0x00000013, 0x00000009, 0x00000015, 0x00000010, 0x0000000A, 0x00000009, 0x00000015,
    0x0000000A, 0x00000009, 0x00000019, 0x0000000B, 0x00000007, 0x0000000C, 0x0000000B, 0x00000007,
    0x00000010, 0x0000000B, 0x00000011, 0x0000000D, 0x0000000B, 0x00000015, 0x0000000D, 0x0000000C,
    0x00000009, 0x00000017, 0x0000000D, 0x00000003, 0x00000011, 0x0000000D, 0x00000003, 0x0000001B,
    0x0000000D, 0x00000005, 0x00000013, 0x0000000D, 0x00000011, 0x0000000F, 0x0000000E, 0x00000001,
    0x0000000F, 0x0000000E, 0x0000000D, 0x0000000F, 0x0000000F, 0x00000001, 0x0000001D, 0x00000011,
    0x0000000F, 0x00000014, 0x00000011, 0x0000000F, 0x00000017, 0x00000011, 0x0000000F, 0x0000001A]

function RNG_Next(num, offset_id){
    let offset_a = rng_offsets[offset_id * 3]
    let offset_b = rng_offsets[offset_id * 3 + 1]
    let offset_c = rng_offsets[offset_id * 3 + 2]
    num = num ^ ((num >>> offset_a) & 0xFFFFFFFF)
    num = num ^ ((num << offset_b) & 0xFFFFFFFF)
    num = num ^ ((num >>> offset_c) & 0xFFFFFFFF)
    return num >>> 0 /* to unsigned */
}


let item_pool_data = {
    0:[
        {id:1,weight:1},
        {id:2,weight:1},
        {id:3,weight:1},
        {id:4,weight:1},
        {id:5,weight:1},
        {id:6,weight:1},
        {id:7,weight:1},
        {id:8,weight:1},
        {id:10,weight:1},
        {id:12,weight:0.5},
        {id:13,weight:1},
        {id:14,weight:1},
        {id:15,weight:1},
        {id:17,weight:0.1},
        {id:19,weight:1},
        {id:36,weight:1},
        {id:37,weight:1},
        {id:38,weight:1},
        {id:39,weight:1},
        {id:40,weight:1},
        {id:41,weight:1},
        {id:42,weight:1},
        {id:44,weight:1},
        {id:45,weight:1},
        {id:46,weight:1},
        {id:47,weight:1},
        {id:48,weight:1},
        {id:49,weight:1},
        {id:52,weight:1},
        {id:53,weight:1},
        {id:55,weight:1},
        {id:56,weight:1},
        {id:57,weight:1},
        {id:58,weight:1},
        {id:62,weight:1},
        {id:65,weight:1},
        {id:66,weight:1},
        {id:67,weight:1},
        {id:68,weight:1},
        {id:69,weight:1},
        {id:71,weight:1},
        {id:72,weight:1},
        {id:75,weight:1},
        {id:76,weight:1},
        {id:77,weight:1},
        {id:78,weight:1},
        {id:85,weight:1},
        {id:86,weight:1},
        {id:87,weight:1},
        {id:88,weight:1},
        {id:89,weight:1},
        {id:91,weight:1},
        {id:92,weight:1},
        {id:93,weight:1},
        {id:94,weight:1},
        {id:95,weight:1},
        {id:96,weight:1},
        {id:97,weight:1},
        {id:98,weight:0.2},
        {id:99,weight:1},
        {id:100,weight:1},
        {id:101,weight:0.5},
        {id:102,weight:1},
        {id:103,weight:1},
        {id:104,weight:1},
        {id:105,weight:1},
        {id:106,weight:1},
        {id:107,weight:1},
        {id:108,weight:1},
        {id:109,weight:1},
        {id:110,weight:1},
        {id:111,weight:1},
        {id:113,weight:1},
        {id:114,weight:0.2},
        {id:115,weight:1},
        {id:117,weight:1},
        {id:120,weight:1},
        {id:121,weight:1},
        {id:123,weight:1},
        {id:124,weight:1},
        {id:125,weight:1},
        {id:127,weight:1},
        {id:128,weight:1},
        {id:129,weight:1},
        {id:131,weight:1},
        {id:136,weight:1},
        {id:137,weight:1},
        {id:138,weight:1},
        {id:140,weight:1},
        {id:142,weight:1},
        {id:143,weight:1},
        {id:144,weight:1},
        {id:146,weight:1},
        {id:148,weight:1},
        {id:149,weight:1},
        {id:150,weight:1},
        {id:151,weight:1},
        {id:152,weight:1},
        {id:153,weight:1},
        {id:154,weight:1},
        {id:155,weight:1},
        {id:157,weight:1},
        {id:160,weight:1},
        {id:161,weight:1},
        {id:162,weight:1},
        {id:163,weight:1},
        {id:166,weight:1},
        {id:167,weight:1},
        {id:169,weight:1},
        {id:170,weight:1},
        {id:171,weight:1},
        {id:172,weight:1},
        {id:173,weight:1},
        {id:174,weight:1},
        {id:175,weight:1},
        {id:176,weight:1},
        {id:178,weight:1},
        {id:180,weight:1},
        {id:186,weight:1},
        {id:188,weight:1},
        {id:189,weight:1},
        {id:190,weight:0.1},
        {id:191,weight:1},
        {id:192,weight:1},
        {id:200,weight:1},
        {id:201,weight:1},
        {id:202,weight:1},
        {id:206,weight:1},
        {id:209,weight:1},
        {id:210,weight:1},
        {id:211,weight:1},
        {id:213,weight:1},
        {id:214,weight:1},
        {id:217,weight:1},
        {id:220,weight:1},
        {id:221,weight:1},
        {id:222,weight:1},
        {id:223,weight:0.5},
        {id:224,weight:1},
        {id:225,weight:1},
        {id:227,weight:1},
        {id:228,weight:1},
        {id:229,weight:1},
        {id:231,weight:1},
        {id:233,weight:1},
        {id:234,weight:1},
        {id:236,weight:1},
        {id:237,weight:0.2},
        {id:240,weight:1},
        {id:242,weight:1},
        {id:244,weight:1},
        {id:245,weight:1},
        {id:256,weight:1},
        {id:257,weight:1},
        {id:261,weight:1},
        {id:264,weight:1},
        {id:265,weight:1},
        {id:266,weight:1},
        {id:267,weight:1},
        {id:268,weight:1},
        {id:269,weight:1},
        {id:270,weight:1},
        {id:271,weight:1},
        {id:272,weight:1},
        {id:273,weight:1},
        {id:274,weight:1},
        {id:275,weight:1},
        {id:276,weight:1},
        {id:277,weight:1},
        {id:278,weight:1},
        {id:279,weight:1},
        {id:280,weight:1},
        {id:281,weight:1},
        {id:282,weight:1},
        {id:283,weight:1},
        {id:284,weight:1},
        {id:285,weight:1},
        {id:287,weight:1},
        {id:288,weight:1},
        {id:291,weight:1},
        {id:292,weight:1},
        {id:294,weight:1},
        {id:295,weight:1},
        {id:298,weight:1},
        {id:299,weight:1},
        {id:300,weight:1},
        {id:301,weight:1},
        {id:302,weight:1},
        {id:303,weight:1},
        {id:304,weight:1},
        {id:305,weight:1},
        {id:306,weight:1},
        {id:307,weight:1},
        {id:308,weight:1},
        {id:309,weight:1},
        {id:310,weight:1},
        {id:312,weight:1},
        {id:313,weight:0.2},
        {id:314,weight:1},
        {id:315,weight:1},
        {id:316,weight:1},
        {id:317,weight:1},
        {id:318,weight:1},
        {id:319,weight:1},
        {id:320,weight:1},
        {id:321,weight:1},
        {id:322,weight:1},
        {id:323,weight:1},
        {id:324,weight:1},
        {id:325,weight:1},
        {id:329,weight:1},
        {id:330,weight:1},
        {id:332,weight:1},
        {id:333,weight:0.2},
        {id:334,weight:0.2},
        {id:335,weight:0.2},
        {id:336,weight:1},
        {id:350,weight:1},
        {id:351,weight:1},
        {id:352,weight:1},
        {id:353,weight:1},
        {id:358,weight:1},
        {id:359,weight:1},
        {id:361,weight:1},
        {id:362,weight:1},
        {id:364,weight:1},
        {id:365,weight:1},
        {id:366,weight:1},
        {id:367,weight:1},
        {id:368,weight:1},
        {id:369,weight:1},
        {id:371,weight:1},
        {id:373,weight:1},
        {id:374,weight:0.2},
        {id:375,weight:1},
        {id:377,weight:1},
        {id:378,weight:1},
        {id:379,weight:1},
        {id:381,weight:1},
        {id:382,weight:1},
        {id:384,weight:1},
        {id:385,weight:1},
        {id:386,weight:1},
        {id:388,weight:1},
        {id:389,weight:1},
        {id:390,weight:1},
        {id:391,weight:1},
        {id:392,weight:1},
        {id:393,weight:1},
        {id:394,weight:1},
        {id:395,weight:1},
        {id:397,weight:1},
        {id:398,weight:1},
        {id:401,weight:1},
        {id:404,weight:1},
        {id:405,weight:1},
        {id:406,weight:1},
        {id:407,weight:1},
        {id:410,weight:1},
        {id:411,weight:1},
        {id:418,weight:1},
        {id:419,weight:1},
        {id:421,weight:1},
        {id:422,weight:1},
        {id:426,weight:1},
        {id:427,weight:1},
        {id:430,weight:1},
        {id:431,weight:1},
        {id:432,weight:1},
        {id:435,weight:1},
        {id:436,weight:1},
        {id:437,weight:1},
        {id:440,weight:1},
        {id:443,weight:1},
        {id:444,weight:1},
        {id:445,weight:1},
        {id:446,weight:1},
        {id:447,weight:1},
        {id:448,weight:1},
        {id:449,weight:1},
        {id:452,weight:1},
        {id:453,weight:1},
        {id:454,weight:1},
        {id:457,weight:1},
        {id:458,weight:1},
        {id:459,weight:1},
        {id:460,weight:1},
        {id:461,weight:1},
        {id:463,weight:1},
        {id:465,weight:1},
        {id:466,weight:1},
        {id:467,weight:1},
        {id:469,weight:1},
        {id:470,weight:1},
        {id:471,weight:1},
        {id:473,weight:1},
        {id:476,weight:1},
        {id:478,weight:1},
        {id:481,weight:1},
        {id:482,weight:1},
        {id:485,weight:1},
        {id:488,weight:1},
        {id:491,weight:1},
        {id:492,weight:1},
        {id:493,weight:1},
        {id:494,weight:1},
        {id:495,weight:1},
        {id:496,weight:1},
        {id:497,weight:1},
        {id:502,weight:1},
        {id:504,weight:1},
        {id:506,weight:1},
        {id:507,weight:1},
        {id:508,weight:1},
        {id:509,weight:1},
        {id:511,weight:1},
        {id:512,weight:1},
        {id:513,weight:1},
        {id:516,weight:1},
        {id:517,weight:1},
        {id:522,weight:1},
        {id:524,weight:1},
        {id:525,weight:1},
        {id:529,weight:1},
        {id:531,weight:1},
        {id:532,weight:1},
        {id:537,weight:1},
        {id:539,weight:1},
        {id:540,weight:1},
        {id:542,weight:1},
        {id:543,weight:1},
        {id:544,weight:1},
        {id:545,weight:1},
        {id:548,weight:1},
        {id:549,weight:1},
        {id:553,weight:1},
        {id:555,weight:1},
        {id:557,weight:1},
        {id:558,weight:1},
        {id:559,weight:1},
        {id:560,weight:1},
        {id:561,weight:1},
        {id:563,weight:1},
        {id:565,weight:1},
        {id:570,weight:1},
        {id:575,weight:1},
        {id:576,weight:1},
        {id:578,weight:1},
        {id:581,weight:1},
        {id:583,weight:1},
        {id:605,weight:1},
        {id:607,weight:1},
        {id:608,weight:1},
        {id:609,weight:0.5},
        {id:610,weight:1},
        {id:611,weight:1},
        {id:612,weight:1},
        {id:614,weight:1},
        {id:615,weight:1},
        {id:616,weight:1},
        {id:617,weight:1},
        {id:618,weight:1},
        {id:625,weight:0.1},
        {id:629,weight:1},
        {id:631,weight:1},
        {id:635,weight:1},
        {id:637,weight:1},
        {id:639,weight:1},
        {id:641,weight:1},
        {id:645,weight:1},
        {id:649,weight:1},
        {id:650,weight:0.5},
        {id:652,weight:1},
        {id:655,weight:1},
        {id:657,weight:1},
        {id:658,weight:1},
        {id:661,weight:1},
        {id:663,weight:1},
        {id:671,weight:1},
        {id:675,weight:1},
        {id:676,weight:1},
        {id:677,weight:0.2},
        {id:678,weight:1},
        {id:680,weight:1},
        {id:681,weight:1},
        {id:682,weight:1},
        {id:683,weight:1},
        {id:687,weight:1},
        {id:690,weight:1},
        {id:693,weight:1},
        {id:695,weight:1},
        {id:703,weight:0.5},
        {id:709,weight:1},
        {id:710,weight:1},
        {id:713,weight:1},
        {id:717,weight:1},
        {id:720,weight:1},
        {id:722,weight:1},
        {id:723,weight:0.1},
        {id:724,weight:1},
        {id:725,weight:1},
        {id:726,weight:1},
        {id:727,weight:1},
        {id:728,weight:0.5},
        {id:729,weight:1},
    ],
    1:[
        {id:21,weight:1},
        {id:33,weight:1},
        {id:54,weight:1},
        {id:60,weight:1},
        {id:63,weight:1},
        {id:64,weight:1},
        {id:75,weight:1},
        {id:85,weight:1},
        {id:102,weight:1},
        {id:116,weight:1},
        {id:137,weight:1},
        {id:139,weight:1},
        {id:147,weight:1},
        {id:156,weight:1},
        {id:164,weight:1},
        {id:177,weight:1},
        {id:195,weight:1},
        {id:199,weight:1},
        {id:203,weight:1},
        {id:204,weight:1},
        {id:205,weight:1},
        {id:208,weight:1},
        {id:227,weight:1},
        {id:232,weight:1},
        {id:246,weight:1},
        {id:247,weight:1},
        {id:248,weight:1},
        {id:249,weight:1},
        {id:250,weight:1},
        {id:251,weight:1},
        {id:252,weight:1},
        {id:260,weight:1},
        {id:286,weight:0.2},
        {id:289,weight:1},
        {id:290,weight:1},
        {id:295,weight:1},
        {id:296,weight:1},
        {id:297,weight:1},
        {id:337,weight:1},
        {id:338,weight:1},
        {id:347,weight:1},
        {id:348,weight:1},
        {id:349,weight:1},
        {id:356,weight:1},
        {id:357,weight:1},
        {id:372,weight:1},
        {id:376,weight:1},
        {id:380,weight:1},
        {id:383,weight:1},
        {id:396,weight:1},
        {id:402,weight:0.5},
        {id:403,weight:1},
        {id:414,weight:1},
        {id:416,weight:1},
        {id:422,weight:1},
        {id:424,weight:0.5},
        {id:425,weight:1},
        {id:434,weight:1},
        {id:439,weight:1},
        {id:451,weight:1},
        {id:472,weight:1},
        {id:475,weight:0.2},
        {id:479,weight:1},
        {id:480,weight:1},
        {id:483,weight:0.5},
        {id:485,weight:0.5},
        {id:486,weight:1},
        {id:487,weight:1},
        {id:505,weight:1},
        {id:514,weight:1},
        {id:515,weight:1},
        {id:518,weight:1},
        {id:520,weight:1},
        {id:521,weight:1},
        {id:523,weight:1},
        {id:527,weight:1},
        {id:534,weight:1},
        {id:535,weight:1},
        {id:566,weight:1},
        {id:585,weight:1},
        {id:599,weight:1},
        {id:602,weight:1},
        {id:603,weight:1},
        {id:604,weight:1},
        {id:619,weight:1},
        {id:621,weight:1},
        {id:623,weight:1},
        {id:624,weight:1},
        {id:638,weight:1},
        {id:642,weight:0.1},
        {id:647,weight:1},
        {id:660,weight:0.5},
        {id:670,weight:1},
        {id:716,weight:1},
        {id:719,weight:0.5},
    ],
    2:[
        {id:14,weight:1},
        {id:22,weight:1},
        {id:23,weight:1},
        {id:24,weight:1},
        {id:25,weight:1},
        {id:26,weight:1},
        {id:27,weight:1},
        {id:28,weight:1},
        {id:29,weight:1},
        {id:30,weight:1},
        {id:31,weight:1},
        {id:32,weight:1},
        {id:51,weight:1},
        {id:70,weight:1},
        {id:92,weight:0.5},
        {id:141,weight:1},
        {id:143,weight:1},
        {id:165,weight:1},
        {id:176,weight:1},
        {id:183,weight:1},
        {id:193,weight:1},
        {id:194,weight:1},
        {id:195,weight:1},
        {id:196,weight:1},
        {id:197,weight:1},
        {id:198,weight:1},
        {id:218,weight:1},
        {id:219,weight:1},
        {id:240,weight:1},
        {id:253,weight:1},
        {id:254,weight:1},
        {id:255,weight:1},
        {id:339,weight:1},
        {id:340,weight:1},
        {id:341,weight:1},
        {id:342,weight:1},
        {id:343,weight:1},
        {id:344,weight:1},
        {id:345,weight:1},
        {id:346,weight:1},
        {id:354,weight:1},
        {id:355,weight:1},
        {id:370,weight:1},
        {id:428,weight:0.5},
        {id:438,weight:1},
        {id:455,weight:1},
        {id:456,weight:1},
        {id:538,weight:1},
        {id:541,weight:1},
        {id:547,weight:1},
        {id:564,weight:1},
        {id:600,weight:1},
        {id:624,weight:1},
        {id:644,weight:1},
        {id:659,weight:1},
        {id:707,weight:1},
        {id:708,weight:1},
        {id:730,weight:1},
        {id:731,weight:1},
    ],
    3:[
        {id:8,weight:1},
        {id:34,weight:1},
        {id:35,weight:1},
        {id:51,weight:1},
        {id:67,weight:1},
        {id:74,weight:1},
        {id:79,weight:1},
        {id:80,weight:1},
        {id:81,weight:1},
        {id:82,weight:1},
        {id:83,weight:1},
        {id:84,weight:1},
        {id:97,weight:1},
        {id:109,weight:1},
        {id:113,weight:1},
        {id:114,weight:1},
        {id:115,weight:1},
        {id:118,weight:1},
        {id:122,weight:1},
        {id:123,weight:1},
        {id:126,weight:1},
        {id:127,weight:0.2},
        {id:133,weight:1},
        {id:134,weight:1},
        {id:145,weight:1},
        {id:157,weight:1},
        {id:159,weight:1},
        {id:163,weight:1},
        {id:172,weight:1},
        {id:187,weight:1},
        {id:212,weight:1},
        {id:215,weight:1},
        {id:216,weight:1},
        {id:225,weight:1},
        {id:230,weight:1},
        {id:237,weight:1},
        {id:241,weight:1},
        {id:259,weight:1},
        {id:262,weight:1},
        {id:268,weight:1},
        {id:269,weight:1},
        {id:275,weight:1},
        {id:278,weight:1},
        {id:292,weight:1},
        {id:311,weight:1},
        {id:360,weight:1},
        {id:391,weight:1},
        {id:399,weight:1},
        {id:408,weight:1},
        {id:409,weight:1},
        {id:411,weight:1},
        {id:412,weight:1},
        {id:417,weight:1},
        {id:420,weight:1},
        {id:431,weight:1},
        {id:433,weight:1},
        {id:441,weight:0.2},
        {id:442,weight:1},
        {id:462,weight:1},
        {id:468,weight:1},
        {id:475,weight:0.2},
        {id:477,weight:0.5},
        {id:498,weight:1},
        {id:519,weight:1},
        {id:526,weight:1},
        {id:530,weight:1},
        {id:536,weight:1},
        {id:545,weight:1},
        {id:554,weight:1},
        {id:556,weight:1},
        {id:569,weight:1},
        {id:572,weight:1},
        {id:577,weight:1},
        {id:606,weight:1},
        {id:634,weight:1},
        {id:646,weight:1},
        {id:654,weight:1},
        {id:665,weight:1},
        {id:672,weight:1},
        {id:679,weight:1},
        {id:684,weight:1},
        {id:692,weight:1},
        {id:694,weight:0.5},
        {id:695,weight:1},
        {id:698,weight:1},
        {id:699,weight:1},
        {id:702,weight:1},
        {id:704,weight:0.5},
        {id:705,weight:0.5},
        {id:706,weight:0.5},
        {id:712,weight:0.5},
        {id:728,weight:1},
    ],
    4:[
        {id:7,weight:1},
        {id:33,weight:1},
        {id:72,weight:1},
        {id:98,weight:1},
        {id:101,weight:1},
        {id:108,weight:1},
        {id:112,weight:1},
        {id:124,weight:1},
        {id:142,weight:1},
        {id:146,weight:1},
        {id:156,weight:1},
        {id:162,weight:1},
        {id:173,weight:1},
        {id:178,weight:1},
        {id:182,weight:1},
        {id:184,weight:1},
        {id:185,weight:1},
        {id:243,weight:1},
        {id:313,weight:1},
        {id:326,weight:1},
        {id:331,weight:1},
        {id:332,weight:1},
        {id:333,weight:1},
        {id:334,weight:1},
        {id:335,weight:1},
        {id:363,weight:1},
        {id:374,weight:1},
        {id:387,weight:1},
        {id:390,weight:1},
        {id:400,weight:1},
        {id:413,weight:1},
        {id:415,weight:1},
        {id:423,weight:1},
        {id:464,weight:1},
        {id:477,weight:0.5},
        {id:490,weight:1},
        {id:498,weight:1},
        {id:499,weight:1},
        {id:510,weight:0.4},
        {id:519,weight:1},
        {id:526,weight:1},
        {id:528,weight:1},
        {id:533,weight:1},
        {id:543,weight:1},
        {id:567,weight:1},
        {id:568,weight:1},
        {id:573,weight:1},
        {id:574,weight:1},
        {id:579,weight:1},
        {id:584,weight:0.5},
        {id:586,weight:1},
        {id:601,weight:1},
        {id:622,weight:1},
        {id:634,weight:1},
        {id:640,weight:1},
        {id:643,weight:1},
        {id:651,weight:1},
        {id:653,weight:1},
        {id:685,weight:1},
        {id:686,weight:1},
        {id:691,weight:0.5},
        {id:696,weight:1},
    ],
    5:[
        {id:11,weight:1},
        {id:16,weight:1},
        {id:17,weight:1},
        {id:20,weight:1},
        {id:35,weight:1},
        {id:84,weight:1},
        {id:120,weight:1},
        {id:121,weight:1},
        {id:127,weight:1},
        {id:168,weight:1},
        {id:190,weight:1},
        {id:213,weight:1},
        {id:226,weight:1},
        {id:242,weight:1},
        {id:258,weight:1},
        {id:262,weight:1},
        {id:263,weight:1},
        {id:271,weight:1},
        {id:286,weight:1},
        {id:287,weight:1},
        {id:316,weight:1},
        {id:321,weight:1},
        {id:348,weight:1},
        {id:388,weight:1},
        {id:389,weight:1},
        {id:402,weight:1},
        {id:405,weight:1},
        {id:424,weight:1},
        {id:450,weight:1},
        {id:489,weight:1},
        {id:500,weight:1},
        {id:501,weight:1},
        {id:546,weight:1},
        {id:562,weight:1},
        {id:571,weight:1},
        {id:580,weight:1},
        {id:582,weight:1},
        {id:609,weight:1},
        {id:612,weight:1},
        {id:625,weight:1},
        {id:628,weight:1},
        {id:632,weight:1},
        {id:636,weight:1},
        {id:664,weight:1},
        {id:667,weight:1},
        {id:669,weight:1},
        {id:674,weight:1},
        {id:675,weight:1},
        {id:677,weight:1},
        {id:688,weight:1},
        {id:689,weight:1},
        {id:691,weight:0.5},
        {id:697,weight:0.5},
        {id:700,weight:1},
        {id:701,weight:1},
        {id:703,weight:1},
        {id:711,weight:1},
        {id:716,weight:1},
        {id:717,weight:1},
        {id:719,weight:1},
        {id:721,weight:1},
        {id:723,weight:1},
    ],
    7:[
        {id:9,weight:1},
        {id:36,weight:1},
        {id:209,weight:1},
        {id:378,weight:1},
        {id:504,weight:1},
        {id:576,weight:1},
    ],
    8:[
        {id:28,weight:1},
        {id:29,weight:1},
        {id:32,weight:1},
        {id:74,weight:1},
        {id:179,weight:0.5},
        {id:194,weight:1},
        {id:196,weight:1},
        {id:255,weight:1},
        {id:341,weight:1},
        {id:343,weight:1},
        {id:344,weight:1},
        {id:354,weight:1},
        {id:355,weight:1},
        {id:370,weight:1},
        {id:428,weight:0.5},
        {id:438,weight:1},
        {id:444,weight:0.1},
        {id:455,weight:1},
        {id:456,weight:1},
        {id:534,weight:0.5},
        {id:571,weight:0.1},
        {id:644,weight:1},
        {id:708,weight:1},
        {id:730,weight:1},
        {id:732,weight:1},
    ],
    9:[
        {id:81,weight:1},
        {id:133,weight:1},
        {id:134,weight:1},
        {id:140,weight:1},
        {id:145,weight:1},
        {id:212,weight:1},
        {id:297,weight:1},
        {id:316,weight:1},
        {id:371,weight:1},
        {id:475,weight:0.1},
        {id:565,weight:0.5},
        {id:580,weight:0.1},
        {id:642,weight:1},
        {id:654,weight:0.2},
        {id:665,weight:1},
    ],
    12:[
        {id:51,weight:1},
        {id:79,weight:1},
        {id:80,weight:1},
        {id:81,weight:1},
        {id:133,weight:1},
        {id:134,weight:1},
        {id:145,weight:1},
        {id:212,weight:1},
        {id:215,weight:1},
        {id:216,weight:1},
        {id:225,weight:1},
        {id:241,weight:1},
        {id:260,weight:1},
        {id:371,weight:1},
        {id:408,weight:1},
        {id:442,weight:1},
        {id:451,weight:1},
        {id:468,weight:1},
        {id:475,weight:0.2},
        {id:496,weight:1},
        {id:503,weight:1},
        {id:508,weight:1},
        {id:536,weight:1},
        {id:565,weight:1},
        {id:569,weight:1},
        {id:580,weight:1},
        {id:642,weight:1},
        {id:654,weight:0.5},
        {id:692,weight:1},
        {id:694,weight:0.5},
        {id:697,weight:0.5},
        {id:702,weight:1},
        {id:711,weight:1},
    ],
    26:[
        {id:588,weight:1},
        {id:589,weight:1},
        {id:590,weight:1},
        {id:591,weight:1},
        {id:592,weight:1},
        {id:593,weight:1},
        {id:594,weight:1},
        {id:595,weight:1},
        {id:596,weight:1},
        {id:597,weight:1},
        {id:598,weight:1},
    ],
}
let item_config_data = {
    1:{quality:3},
    2:{quality:2},
    3:{quality:3},
    4:{quality:4},
    5:{quality:0},
    6:{quality:2},
    7:{quality:3},
    8:{quality:1},
    9:{quality:0},
    10:{quality:3},
    11:{quality:2},
    12:{quality:4},
    13:{quality:2},
    14:{quality:2},
    15:{quality:2},
    16:{quality:2},
    17:{quality:3},
    18:{quality:3},
    19:{quality:0},
    20:{quality:3,achievement_id:8},
    21:{quality:2},
    22:{quality:1},
    23:{quality:1},
    24:{quality:1},
    25:{quality:1},
    26:{quality:1},
    27:{quality:1},
    28:{quality:1},
    29:{quality:1},
    30:{quality:1},
    31:{quality:1},
    32:{quality:3,achievement_id:139},
    33:{quality:1},
    34:{quality:2},
    35:{quality:1,achievement_id:36},
    36:{quality:0},
    37:{quality:1},
    38:{quality:2},
    39:{quality:1},
    40:{quality:0},
    41:{quality:0},
    42:{quality:1},
    44:{quality:0},
    45:{quality:1},
    46:{quality:2},
    47:{quality:1},
    48:{quality:3},
    49:{quality:2},
    50:{quality:3},
    51:{quality:3},
    52:{quality:4,achievement_id:11},
    53:{quality:1},
    54:{quality:2},
    55:{quality:1},
    56:{quality:1},
    57:{quality:2},
    58:{quality:3},
    59:{quality:0},
    60:{quality:1},
    62:{quality:1},
    63:{quality:2},
    64:{quality:2},
    65:{quality:1},
    66:{quality:1},
    67:{quality:1},
    68:{quality:3},
    69:{quality:3},
    70:{quality:3},
    71:{quality:2},
    72:{quality:2},
    73:{quality:2,achievement_id:6},
    74:{quality:1,achievement_id:10},
    75:{quality:2},
    76:{quality:2},
    77:{quality:1},
    78:{quality:3,achievement_id:7},
    79:{quality:3},
    80:{quality:3},
    81:{quality:3},
    82:{quality:3},
    83:{quality:3,achievement_id:9},
    84:{quality:0},
    85:{quality:2},
    86:{quality:1,achievement_id:13},
    87:{quality:1,achievement_id:15},
    88:{quality:1,achievement_id:14},
    89:{quality:2},
    90:{quality:3,achievement_id:12},
    91:{quality:2},
    92:{quality:2,achievement_id:19},
    93:{quality:2,achievement_id:26},
    94:{quality:1,achievement_id:21},
    95:{quality:1},
    96:{quality:2,achievement_id:25},
    97:{quality:2,achievement_id:22},
    98:{quality:4,achievement_id:20},
    99:{quality:2,achievement_id:23},
    100:{quality:1,achievement_id:24},
    101:{quality:2,achievement_id:27},
    102:{quality:1},
    103:{quality:1},
    104:{quality:3,achievement_id:31},
    105:{quality:4,achievement_id:29},
    106:{quality:2,achievement_id:28},
    107:{quality:2},
    108:{quality:4},
    109:{quality:3},
    110:{quality:3,achievement_id:35},
    111:{quality:0},
    112:{quality:2,achievement_id:45},
    113:{quality:2,achievement_id:47},
    114:{quality:4,achievement_id:43},
    115:{quality:2},
    116:{quality:2},
    117:{quality:0},
    118:{quality:4},
    119:{quality:2,achievement_id:147},
    120:{quality:2},
    121:{quality:2},
    122:{quality:2},
    123:{quality:1},
    124:{quality:1},
    125:{quality:2},
    126:{quality:0,achievement_id:44},
    127:{quality:3,achievement_id:48},
    128:{quality:1},
    129:{quality:1},
    130:{quality:2},
    131:{quality:2,achievement_id:46},
    132:{quality:3},
    133:{quality:3},
    134:{quality:2},
    135:{quality:1},
    136:{quality:1},
    137:{quality:1},
    138:{quality:2},
    139:{quality:3},
    140:{quality:1},
    141:{quality:0},
    142:{quality:2},
    143:{quality:2},
    144:{quality:0},
    145:{quality:3},
    146:{quality:3},
    147:{quality:1},
    148:{quality:0},
    149:{quality:4,achievement_id:140},
    150:{quality:3},
    151:{quality:3},
    152:{quality:2},
    153:{quality:3},
    154:{quality:2},
    155:{quality:2},
    156:{quality:2},
    157:{quality:3,achievement_id:54},
    158:{quality:3},
    159:{quality:3},
    160:{quality:2},
    161:{quality:1},
    162:{quality:1,achievement_id:50},
    163:{quality:1},
    164:{quality:2,achievement_id:59},
    165:{quality:3},
    166:{quality:2,achievement_id:49},
    167:{quality:1},
    168:{quality:4,achievement_id:62},
    169:{quality:4},
    170:{quality:3},
    171:{quality:1},
    172:{quality:2,achievement_id:53},
    173:{quality:3},
    174:{quality:1},
    175:{quality:1,achievement_id:58},
    176:{quality:1},
    177:{quality:0},
    178:{quality:3},
    179:{quality:3,achievement_id:113},
    180:{quality:0},
    181:{quality:2},
    182:{quality:4},
    183:{quality:3},
    184:{quality:3},
    185:{quality:3},
    186:{quality:0,achievement_id:56},
    187:{quality:1,achievement_id:65},
    188:{quality:0,achievement_id:51},
    189:{quality:3,achievement_id:63},
    190:{quality:3},
    191:{quality:2},
    192:{quality:0},
    193:{quality:2},
    194:{quality:1},
    195:{quality:1},
    196:{quality:3},
    197:{quality:2},
    198:{quality:1},
    199:{quality:3},
    200:{quality:1},
    201:{quality:3},
    202:{quality:2},
    203:{quality:3},
    204:{quality:1},
    205:{quality:1},
    206:{quality:2,achievement_id:107},
    207:{quality:2,achievement_id:6},
    208:{quality:3},
    209:{quality:2},
    210:{quality:1},
    211:{quality:1},
    212:{quality:2},
    213:{quality:2},
    214:{quality:0},
    215:{quality:3},
    216:{quality:3},
    217:{quality:3},
    218:{quality:2},
    219:{quality:2},
    220:{quality:2},
    221:{quality:3,achievement_id:150},
    222:{quality:2},
    223:{quality:4},
    224:{quality:3},
    225:{quality:2},
    226:{quality:2},
    227:{quality:1},
    228:{quality:2},
    229:{quality:2},
    230:{quality:4,achievement_id:128},
    231:{quality:2},
    232:{quality:4,achievement_id:138},
    233:{quality:0},
    234:{quality:4},
    236:{quality:1},
    237:{quality:3,achievement_id:103},
    238:{quality:0},
    239:{quality:0},
    240:{quality:1,achievement_id:141},
    241:{quality:3},
    242:{quality:2},
    243:{quality:3},
    244:{quality:3,achievement_id:104},
    245:{quality:4},
    246:{quality:2,achievement_id:134},
    247:{quality:2},
    248:{quality:2},
    249:{quality:3,achievement_id:135},
    250:{quality:1},
    251:{quality:2},
    252:{quality:1,achievement_id:146},
    253:{quality:2},
    254:{quality:2},
    255:{quality:3},
    256:{quality:1},
    257:{quality:2},
    258:{quality:2,achievement_id:105},
    259:{quality:3},
    260:{quality:3,achievement_id:136},
    261:{quality:4},
    262:{quality:0},
    263:{quality:2,achievement_id:233},
    264:{quality:2},
    265:{quality:3},
    266:{quality:2},
    267:{quality:1,achievement_id:102},
    268:{quality:3},
    269:{quality:1},
    270:{quality:1},
    271:{quality:2,achievement_id:124},
    272:{quality:1},
    273:{quality:1},
    274:{quality:0},
    275:{quality:3},
    276:{quality:0,achievement_id:129},
    277:{quality:1},
    278:{quality:4},
    279:{quality:2},
    280:{quality:1},
    281:{quality:1},
    282:{quality:1},
    283:{quality:3,achievement_id:133},
    284:{quality:3,achievement_id:148},
    285:{quality:0},
    286:{quality:2,achievement_id:121},
    287:{quality:0,achievement_id:122},
    288:{quality:1},
    289:{quality:2,achievement_id:137},
    290:{quality:0},
    291:{quality:1},
    292:{quality:4,achievement_id:126},
    293:{quality:2,achievement_id:143},
    294:{quality:1,achievement_id:145},
    295:{quality:1},
    296:{quality:2},
    297:{quality:2,achievement_id:119},
    298:{quality:1},
    299:{quality:1},
    300:{quality:2},
    301:{quality:3},
    302:{quality:1},
    303:{quality:2},
    304:{quality:1},
    305:{quality:3},
    306:{quality:3},
    307:{quality:3},
    308:{quality:1},
    309:{quality:2},
    310:{quality:2,achievement_id:112},
    311:{quality:4,achievement_id:108},
    312:{quality:2,achievement_id:109},
    313:{quality:4},
    314:{quality:1},
    315:{quality:0},
    316:{quality:0},
    317:{quality:3},
    318:{quality:1},
    319:{quality:0,achievement_id:110},
    320:{quality:2,achievement_id:114},
    321:{quality:1,achievement_id:115},
    322:{quality:2},
    323:{quality:0,achievement_id:106},
    324:{quality:2,achievement_id:125},
    325:{quality:1,achievement_id:30},
    326:{quality:0},
    327:{quality:2,achievement_id:57},
    328:{quality:2,achievement_id:78},
    329:{quality:2},
    330:{quality:2},
    331:{quality:4,achievement_id:156},
    332:{quality:1,achievement_id:116},
    333:{quality:3,achievement_id:130},
    334:{quality:3,achievement_id:131},
    335:{quality:3,achievement_id:132},
    336:{quality:3},
    337:{quality:1},
    338:{quality:2},
    339:{quality:1},
    340:{quality:1},
    341:{quality:3},
    342:{quality:3},
    343:{quality:2},
    344:{quality:1},
    345:{quality:3},
    346:{quality:1},
    347:{quality:3},
    348:{quality:2},
    349:{quality:1,achievement_id:244},
    350:{quality:3},
    351:{quality:1},
    352:{quality:1},
    353:{quality:2},
    354:{quality:2},
    355:{quality:2},
    356:{quality:3},
    357:{quality:1,achievement_id:203},
    358:{quality:1},
    359:{quality:3},
    360:{quality:4,achievement_id:190},
    361:{quality:2,achievement_id:183},
    362:{quality:2,achievement_id:192},
    363:{quality:3,achievement_id:189},
    364:{quality:1},
    365:{quality:1},
    366:{quality:1},
    367:{quality:1},
    368:{quality:1},
    369:{quality:2},
    370:{quality:3},
    371:{quality:1},
    372:{quality:3},
    373:{quality:3},
    374:{quality:3},
    375:{quality:3},
    376:{quality:2},
    377:{quality:1},
    378:{quality:2},
    379:{quality:2},
    380:{quality:2},
    381:{quality:3,achievement_id:188},
    382:{quality:2},
    383:{quality:1},
    384:{quality:2},
    385:{quality:1},
    386:{quality:0,achievement_id:181},
    387:{quality:3,achievement_id:193},
    388:{quality:0,achievement_id:200},
    389:{quality:3,achievement_id:218},
    390:{quality:3},
    391:{quality:0,achievement_id:182},
    392:{quality:1,achievement_id:202},
    393:{quality:2,achievement_id:220},
    394:{quality:1},
    395:{quality:4},
    396:{quality:1},
    397:{quality:3},
    398:{quality:1},
    399:{quality:4,achievement_id:186},
    400:{quality:1},
    401:{quality:2},
    402:{quality:3},
    403:{quality:1},
    404:{quality:1,achievement_id:179},
    405:{quality:1,achievement_id:201},
    406:{quality:2,achievement_id:231},
    407:{quality:2,achievement_id:180},
    408:{quality:1,achievement_id:184},
    409:{quality:2,achievement_id:187},
    410:{quality:2,achievement_id:194},
    411:{quality:3,achievement_id:198},
    412:{quality:2,achievement_id:219},
    413:{quality:1,achievement_id:222},
    414:{quality:3,achievement_id:135},
    415:{quality:4},
    416:{quality:2,achievement_id:238},
    417:{quality:3,achievement_id:221},
    418:{quality:2},
    419:{quality:3},
    420:{quality:1},
    421:{quality:1},
    422:{quality:3},
    423:{quality:1},
    424:{quality:3},
    425:{quality:2},
    426:{quality:0},
    427:{quality:1},
    428:{quality:2},
    429:{quality:2},
    430:{quality:1},
    431:{quality:2},
    432:{quality:2},
    433:{quality:0,achievement_id:195},
    434:{quality:2},
    435:{quality:1},
    436:{quality:1},
    437:{quality:1},
    438:{quality:3},
    439:{quality:3},
    440:{quality:2,achievement_id:232},
    441:{quality:4,achievement_id:276},
    442:{quality:1,achievement_id:290},
    443:{quality:3},
    444:{quality:3},
    445:{quality:1},
    446:{quality:1},
    447:{quality:0},
    448:{quality:1},
    449:{quality:1},
    450:{quality:2,achievement_id:308},
    451:{quality:3},
    452:{quality:2},
    453:{quality:2,achievement_id:291},
    454:{quality:2},
    455:{quality:2,achievement_id:307},
    456:{quality:1},
    457:{quality:2},
    458:{quality:3},
    459:{quality:3},
    460:{quality:2},
    461:{quality:3},
    462:{quality:3,achievement_id:299},
    463:{quality:2},
    464:{quality:2,achievement_id:297},
    465:{quality:2},
    466:{quality:2},
    467:{quality:1},
    468:{quality:0,achievement_id:285},
    469:{quality:1},
    470:{quality:0,achievement_id:315},
    471:{quality:2},
    472:{quality:1,achievement_id:286},
    473:{quality:1},
    474:{quality:0},
    475:{quality:0,achievement_id:305},
    476:{quality:4,achievement_id:296},
    477:{quality:4,achievement_id:295},
    478:{quality:1},
    479:{quality:3,achievement_id:318},
    480:{quality:2},
    481:{quality:0},
    482:{quality:0},
    483:{quality:3},
    484:{quality:1},
    485:{quality:1,achievement_id:294},
    486:{quality:1,achievement_id:288},
    487:{quality:2},
    488:{quality:1,achievement_id:303},
    489:{quality:4,achievement_id:282},
    490:{quality:3,achievement_id:289},
    491:{quality:2},
    492:{quality:2},
    493:{quality:1},
    494:{quality:3},
    495:{quality:3},
    496:{quality:3,achievement_id:292},
    497:{quality:0},
    498:{quality:1,achievement_id:306},
    499:{quality:3,achievement_id:283},
    500:{quality:3,achievement_id:298},
    501:{quality:1,achievement_id:335},
    502:{quality:1},
    503:{quality:3},
    504:{quality:0,achievement_id:316},
    505:{quality:1},
    506:{quality:1},
    507:{quality:2},
    508:{quality:1},
    509:{quality:1},
    510:{quality:1,achievement_id:338},
    511:{quality:1,achievement_id:352},
    512:{quality:1,achievement_id:349},
    513:{quality:2,achievement_id:353},
    514:{quality:2,achievement_id:354},
    515:{quality:3,achievement_id:350},
    516:{quality:2,achievement_id:351},
    517:{quality:1,achievement_id:356},
    518:{quality:2,achievement_id:355},
    519:{quality:2,achievement_id:357},
    520:{quality:3,achievement_id:367},
    521:{quality:2,achievement_id:364},
    522:{quality:1,achievement_id:365},
    523:{quality:1,achievement_id:366},
    524:{quality:3,achievement_id:369},
    525:{quality:1,achievement_id:368},
    526:{quality:2,achievement_id:372},
    527:{quality:3,achievement_id:371},
    528:{quality:3,achievement_id:373},
    529:{quality:2,achievement_id:374},
    530:{quality:2,achievement_id:376},
    531:{quality:3,achievement_id:377},
    532:{quality:2,achievement_id:378},
    533:{quality:2,achievement_id:380},
    534:{quality:3,achievement_id:379},
    535:{quality:2,achievement_id:385},
    536:{quality:2,achievement_id:383},
    537:{quality:1,achievement_id:384},
    538:{quality:2,achievement_id:386},
    539:{quality:1,achievement_id:387},
    540:{quality:2,achievement_id:382},
    541:{quality:1,achievement_id:392},
    542:{quality:2,achievement_id:393},
    543:{quality:1,achievement_id:398},
    544:{quality:2,achievement_id:394},
    545:{quality:3,achievement_id:401},
    546:{quality:3,achievement_id:400},
    547:{quality:3,achievement_id:397},
    548:{quality:1,achievement_id:395},
    549:{quality:3,achievement_id:396},
    550:{quality:4},
    551:{quality:4},
    552:{quality:4},
    553:{quality:3},
    554:{quality:2},
    555:{quality:2,achievement_id:583},
    556:{quality:3},
    557:{quality:2},
    558:{quality:2},
    559:{quality:2},
    560:{quality:1},
    561:{quality:1},
    562:{quality:3,achievement_id:433},
    563:{quality:1},
    564:{quality:3},
    565:{quality:1,achievement_id:462},
    566:{quality:2},
    567:{quality:3},
    568:{quality:2,achievement_id:423},
    569:{quality:2},
    570:{quality:3},
    571:{quality:2},
    572:{quality:3},
    573:{quality:3},
    574:{quality:2},
    575:{quality:3},
    576:{quality:2,achievement_id:517},
    577:{quality:2,achievement_id:432},
    578:{quality:1},
    579:{quality:3,achievement_id:520},
    580:{quality:3,achievement_id:415},
    581:{quality:4},
    582:{quality:1},
    583:{quality:2},
    584:{quality:3,achievement_id:417},
    585:{quality:2,achievement_id:420},
    586:{quality:3,achievement_id:429},
    588:{quality:2},
    589:{quality:2},
    590:{quality:3},
    591:{quality:2},
    592:{quality:3},
    593:{quality:2},
    594:{quality:2},
    595:{quality:2},
    596:{quality:3},
    597:{quality:3},
    598:{quality:3},
    599:{quality:1},
    600:{quality:3},
    601:{quality:3},
    602:{quality:1,achievement_id:582},
    603:{quality:1},
    604:{quality:2},
    605:{quality:0},
    606:{quality:3},
    607:{quality:1},
    608:{quality:2},
    609:{quality:3,achievement_id:448},
    610:{quality:1,achievement_id:450},
    611:{quality:2,achievement_id:497},
    612:{quality:2,achievement_id:460},
    614:{quality:1},
    615:{quality:0},
    616:{quality:3},
    617:{quality:3},
    618:{quality:2},
    619:{quality:3,achievement_id:431},
    621:{quality:2,achievement_id:430},
    622:{quality:2,achievement_id:436},
    623:{quality:1},
    624:{quality:1},
    625:{quality:4,achievement_id:547},
    626:{quality:0},
    627:{quality:0},
    628:{quality:4,achievement_id:636},
    629:{quality:3},
    631:{quality:1,achievement_id:440},
    632:{quality:2},
    633:{quality:0},
    634:{quality:2,achievement_id:519},
    635:{quality:1},
    636:{quality:4},
    637:{quality:3},
    638:{quality:2},
    639:{quality:2,achievement_id:442},
    640:{quality:3,achievement_id:418},
    641:{quality:2,achievement_id:446},
    642:{quality:2,achievement_id:472},
    643:{quality:4,achievement_id:470},
    644:{quality:1},
    645:{quality:1,achievement_id:456},
    646:{quality:3,achievement_id:546},
    647:{quality:2},
    649:{quality:1,achievement_id:409},
    650:{quality:2,achievement_id:410},
    651:{quality:2,achievement_id:425},
    652:{quality:1},
    653:{quality:3,achievement_id:424},
    654:{quality:2},
    655:{quality:1},
    656:{quality:2,achievement_id:432},
    657:{quality:2},
    658:{quality:1},
    659:{quality:1},
    660:{quality:3},
    661:{quality:2},
    663:{quality:2},
    664:{quality:4},
    665:{quality:2,achievement_id:444},
    667:{quality:2,achievement_id:503},
    668:{quality:0},
    669:{quality:3},
    670:{quality:2,achievement_id:441},
    671:{quality:2,achievement_id:443},
    672:{quality:1,achievement_id:445},
    673:{quality:2,achievement_id:447},
    674:{quality:2,achievement_id:469},
    675:{quality:1,achievement_id:451},
    676:{quality:2,achievement_id:453},
    677:{quality:2,achievement_id:457},
    678:{quality:4,achievement_id:463},
    679:{quality:3,achievement_id:455},
    680:{quality:3,achievement_id:449},
    681:{quality:1,achievement_id:466},
    682:{quality:3,achievement_id:467},
    683:{quality:2,achievement_id:468},
    684:{quality:3,achievement_id:461},
    685:{quality:2,achievement_id:471},
    686:{quality:2,achievement_id:422},
    687:{quality:3,achievement_id:473},
    688:{quality:2,achievement_id:434},
    689:{quality:4,achievement_id:491},
    690:{quality:3,achievement_id:492},
    691:{quality:4,achievement_id:501},
    692:{quality:1,achievement_id:494},
    693:{quality:2,achievement_id:495},
    694:{quality:3,achievement_id:496},
    695:{quality:3,achievement_id:452},
    696:{quality:3,achievement_id:499},
    697:{quality:3,achievement_id:435},
    698:{quality:4,achievement_id:502},
    699:{quality:3,achievement_id:498},
    700:{quality:2,achievement_id:504},
    701:{quality:3,achievement_id:505},
    702:{quality:2,achievement_id:506},
    703:{quality:2,achievement_id:507},
    704:{quality:3,achievement_id:590},
    705:{quality:3,achievement_id:587},
    706:{quality:4,achievement_id:597},
    707:{quality:1},
    708:{quality:3},
    709:{quality:3,achievement_id:437},
    710:{quality:4,achievement_id:586},
    711:{quality:4,achievement_id:592},
    712:{quality:3,achievement_id:599},
    713:{quality:3,achievement_id:589},
    714:{quality:0},
    715:{quality:0},
    716:{quality:3,achievement_id:464},
    717:{quality:2,achievement_id:596},
    719:{quality:2,achievement_id:465},
    720:{quality:2,achievement_id:459},
    721:{quality:2,achievement_id:500},
    722:{quality:3,achievement_id:600},
    723:{quality:4,achievement_id:584},
    724:{quality:3,achievement_id:585},
    725:{quality:2,achievement_id:588},
    726:{quality:3,achievement_id:591},
    727:{quality:2,achievement_id:594},
    728:{quality:2,achievement_id:595},
    729:{quality:2,achievement_id:598},
    730:{quality:3},
    731:{quality:2},
    732:{quality:3},
}

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
    if(achievement_id == 0)
        return true
        
    if(document.getElementById("achievement_unlocked").checked /* xxxx */)
       return true

    // I dont know what it is, maybe daily run
    // if( cond1 == 2 && (cond2.x || cond2.y))
    //     return true
    return false
}

function get_result(input_array, gameStartSeed){

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
        if(gameStartSeed == 0){
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
    return search_result.output
}

let input_array = [0x8,0x2,0x16,0xc,8,8,9,0xf] //[0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x1n]
console.log(get_result(input_array, str2seed('JKD9 Z0C9')))

let current_pool = [0,0,0,0,0,0,0,0]
let current_output = "unknown"
function flush_ui(){
    for(let i=0;i<8;i++){
        let view = document.getElementById('view-'+i)
        for(let j=0;j<28;j++){
            view.classList.remove('bofsym_'+j)
        }
        view.className += 'bofsym_'+current_pool[i]
    }
    document.getElementById('output_textbox').value = current_output
}
function flush_result(){
    if(current_pool[7] != 0){
        let seed = str2seed(document.getElementById('seed_input').value)
        if(seed == 0){
            current_output = "Invalid Seed!"
        }else{
            console.log(seed)
            current_output = "Item " + get_result(current_pool, seed)    
        }
    }else{
        current_output = "Not full"
    }
}
flush_ui()

document.getElementById('scroll').addEventListener('click',()=>{
    let temp = current_pool[0]
    let i=0;
    for(i=0;i<7 && current_pool[i+1] != 0;i++){
        current_pool[i] = current_pool[i+1]
    }
    current_pool[i] = temp
    console.log(current_pool)
    flush_ui()
})

for(let i=1;i<26;i++){
    document.getElementById('add_btn_'+i).addEventListener('click',()=>{
        if(current_pool[7] != 0){
            for(let j=0;j<7;j++){
                current_pool[j] = current_pool[j+1]
            }
            current_pool[7] = i
        }
        for(let j=0;j<8;j++){
            if(current_pool[j] == 0){
                current_pool[j] = i
                break
            }
        }
        flush_result()
        flush_ui()    
    })
}
document.getElementById('seed_input').addEventListener('change',()=>{
    flush_result()
    flush_ui()    
})
document.getElementById('achievement_unlocked').addEventListener('change',()=>{
    flush_result()
    flush_ui()    
})