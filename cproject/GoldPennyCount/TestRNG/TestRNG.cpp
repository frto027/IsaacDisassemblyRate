//通过穷举解空间，我们可以找到最持久的金硬币
// 游戏的随机数种子是(1)~(2^32-1)
// 现代CPU很强大，各种软硬件优化骚操作，我们没必要做特殊算法优化，一切从简，很快就能穷举解空间
// ↑指的是C++语言
// 
// 此程序性能严重依赖编译优化，建议使用Release x64编译，且不要调试执行，来确保程序性能
#include <iostream>
#include <Windows.h>

//下面两个变量控制当前脚本的多线程计算方式

//128线程
//#define THREAD_STEP 0x2000000
//#define MAX_THREAD_COUNT 128

//64线程
//#define THREAD_STEP 0x4000000
//#define MAX_THREAD_COUNT 64

//32线程
//#define THREAD_STEP 0x8000000
//#define MAX_THREAD_COUNT 32


//16线程
#define THREAD_STEP 0x10000000
#define MAX_THREAD_COUNT 16

//8线程
//#define THREAD_STEP 0x20000000
//#define MAX_THREAD_COUNT 8

//单线程
//#define THREAD_STEP 0x100000000
//#define MAX_THREAD_COUNT 1

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


HANDLE seedMutex;
int maxseed = 0;
int max_num = 0;

DWORD TestSeed(LPVOID arr) {
    long long* a =(long long*) arr;
    for (long long i = a[0]; i < a[1]; i++) {
        int count = GetGoldPennyCount(i);
        if (count > max_num) {
            if (WaitForSingleObject(seedMutex, INFINITE) != WAIT_OBJECT_0) {
                exit(-1);
            }

            if (count > max_num) {
                max_num = count;
                maxseed = i;
                printf("seed:%u,num:%d\n", maxseed, max_num);
            }

            ReleaseMutex(seedMutex);
        }
    }
    delete arr;
}

int main()
{
    
    HANDLE threads[MAX_THREAD_COUNT];
    
    seedMutex = CreateMutex(NULL, FALSE, NULL);
    long long thread_count = 0;
    for (long long i = 0; i < 0x100000000; i += THREAD_STEP) {
        if (thread_count >= MAX_THREAD_COUNT) {
            printf("no enough thread!");
            exit(-1);
        }
        long long* arr = new long long[2];
        arr[0] = i;
        arr[1] = i + THREAD_STEP;
        if (arr[0] == 0) {
            arr[0]++;
        }
        threads[thread_count] = CreateThread(NULL, 0, TestSeed, arr, 0, NULL);
        if (threads[thread_count] == NULL) {
            printf("create thread failed!");
        }
        thread_count++;
    }
    WaitForMultipleObjects(thread_count, threads, TRUE, INFINITE);

    for (int i = 0; i < thread_count; i++) {
        CloseHandle(threads[i]);
    }
    CloseHandle(seedMutex);
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