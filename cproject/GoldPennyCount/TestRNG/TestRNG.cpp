//通过穷举解空间，我们可以找到最持久的金硬币
// 游戏的随机数种子是(1)~(2^32-1)
// 现代CPU很强大，各种软硬件优化骚操作，我们没必要做特殊算法优化，一切从简，很快就能穷举解空间
// ↑指的是C++语言
// 
// 此程序性能严重依赖编译优化，建议使用Release x64编译，且不要调试执行，来确保程序性能
#include <iostream>
//使用模板类来加速执行，达到最佳机器优化
template<int a,int b,int c>
class RNG {
private:
    uint32_t seed;
    //int a, b, c;
public:
    //void setOffset(int a, int b, int c) {
    //    this->a = a;
    //    this->b = b;
    //    this->c = c;
    //}
    void setSeed(uint32_t seed) {
        this->seed = seed;
    }

    inline uint32_t nextInt() {
        seed = seed ^ (seed >> a) ^ ((seed ^ (seed >> a)) << b) ^ ((seed ^ (seed >> a) ^ ((seed ^ (seed >> a)) << b)) >> c);
        return seed;
    }

    inline float nextFloat() {
        return 2.3283062e-10 * nextInt();
    }
};

inline int GetGoldPennyCount(uint32_t seed) {
    RNG<4, 3, 0x11> rng;

    float rate = 1;
    float pow = 0.9800000191;
    int count = 0;
    rng.setSeed(seed);
    while (rng.nextFloat() <= rate) {
        rate *= pow;
        count++;
        rng.nextInt();
    }
    return count + 1;
}

int main()
{
    int maxseed = 0;
    int max_num = GetGoldPennyCount(1);
    //单核足够了
    for (long long i = 1; i < 0x100000000; i++) {
        if (i % 0x10000000 == 0) {
            printf("%lld/16\n", i / 0x10000000);
        }
        int c = GetGoldPennyCount(i);
        if (c > max_num) {
            max_num = c;
            maxseed = i;
            printf("seed:%u,num:%d\n", maxseed, max_num);
        }
    }
    return 0;
}
/**
seed:4,num:18
seed:38,num:21
seed:51,num:24
seed:411,num:28
seed:1597,num:29
seed:2101,num:30
seed:9681,num:36
seed:376605,num:39
seed:8767523,num:43
seed:35015260,num:44
seed:127558145,num:45
1/16
2/16
seed:719283723,num:46
3/16
seed:1030931282,num:48
4/16
5/16
6/16
seed:1703196635,num:50
7/16
8/16
9/16
10/16
11/16
12/16
13/16
14/16
15/16

C:\Users\q6027\Desktop\IsaacDisassemblyRate\cproject\TestRNG\Release\TestRNG.exe (进程 3376)已退出，代码为 0。
按任意键关闭此窗口. . .
*/