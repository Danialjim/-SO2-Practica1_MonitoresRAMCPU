#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
#include <linux/mm.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/quicklist.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <asm/page.h>
#include <asm/pgtable.h>

#define PROCFS_NAME "memo_201313982"

struct sysinfo i;
unsigned long committed;
unsigned long allowed;
long cached;
unsigned long pages[NR_LRU_LISTS];
int lru;

static int OS2_show(struct seq_file *m, void *v){

#define K(x) ((x) << (PAGE_SHIFT - 10))
si_meminfo(&i);
for (lru = LRU_BASE; lru < NR_LRU_LISTS; lru++)
pages[lru] = global_numa_state(NR_LRU_BASE + lru);
seq_printf(m,"MemTotal: %8lu kB\n",K(i.totalram));
seq_printf(m,"MemFree: %8lu kB",K(i.freeram));
return 0;
}

static int OS2_open(struct inode *inode, struct file *file){
return single_open(file, OS2_show, NULL);
}

static const struct file_operations OS2_fops = {
.owner = THIS_MODULE,
.open = OS2_open,
.read = seq_read,
.llseek = seq_lseek,
.release = single_release,
};

static int __init OS2_init(void){
printk(KERN_INFO "MI CARNET: 201313982\r\n");
proc_create(PROCFS_NAME, 0, NULL, &OS2_fops);
return 0;
}

static void __exit OS2_exit(void){
remove_proc_entry(PROCFS_NAME, NULL);
printk(KERN_INFO "NOMBRE DEL CURSO: SISTEMAS OPERATIVOS 1\r\n");
}

module_init(OS2_init);
module_exit(OS2_exit);

MODULE_LICENSE("GPL");
