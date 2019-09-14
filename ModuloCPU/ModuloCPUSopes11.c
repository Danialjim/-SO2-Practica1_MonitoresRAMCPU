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

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>

 
struct task_struct *task;      
struct task_struct *task_child;
struct list_head *list;        
 
#define PROCFS_NAME "cpu_201313982222"

int iterate_init(struct seq_file *m, void *v)       
{

    for_each_process( task ){   
         
        seq_printf(m,"\n%d&%s&%lld&%ld",task->pid, task->comm,task->acct_vm_mem1, task->state);
	list_for_each(list, &task->children){     
        	task_child = list_entry( list, struct task_struct, sibling );
     
            seq_printf(m, "\nH%dA&%d&%s&%lld&%ld",task->pid, task_child->pid, task_child->comm,task_child->acct_vm_mem1, task_child->state);
        }
    }    
     
 
    return 0;
 
}                
     
static int OS2_open(struct inode *inode, struct file *file){
return single_open(file, iterate_init, NULL);
}

static const struct file_operations OS2_fops = {
.owner = THIS_MODULE,
.open = OS2_open,
.read = seq_read,
.llseek = seq_lseek,
.release = single_release,
};

static int __init OS2_init(void){
printk(KERN_INFO "MI NOMBRE: CARLOS DANIEL ALONZO JIMENEZ\r\n");
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
