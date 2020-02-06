import GodGuide from "./GodGuide";

//根据命令
export class GodCommand {

    static readonly DIALOGUE: string = 'dialogue';//对话框
    static readonly FINGER: string = 'finger';//节点定位加手指指引
    static readonly TEXT: string = 'text';//文本显示
    static readonly LOCATOR: string = 'locator';//节点定位
    static readonly SAVE: string = 'save';//保存进度

    static readonly typeList = [GodCommand.DIALOGUE, GodCommand.FINGER, GodCommand.TEXT, GodCommand.LOCATOR, GodCommand.SAVE];

    //定位节点
    static async locator(godGuide, step) {
        return new Promise((resolve, reject)=>{
            let { args } = step.command;
            godGuide.find(args, (node) => {
                godGuide._targetNode = node;

                //点击确认
                node.once(cc.Node.EventType.TOUCH_END, () => {
                    cc.log('节点被点击');
                    //任务完成
                    resolve();
                });
                //触摸模拟
                let autorun = godGuide.getTask().autorun;
                if (autorun) {
                    godGuide.touchSimulation(node);
                }
            });
        })
    }

    //定位节点，显示一个手指动画
    static async finger(godGuide, step) {
        return new Promise((resolve, reject)=>{
            let { args } = step.command;
            godGuide._targetNode = null;
            //定位节点
            godGuide.find(args, (node) => {
                //手指动画
                godGuide.fingerToNode(node, () => {
                    godGuide._targetNode = node;
                    //点击确认
                    node.once(cc.Node.EventType.TOUCH_END, () => {
                        cc.log('节点被点击');
                        //任务完成
                        resolve();
                    });
                });

                //触摸模拟
                let autorun = godGuide.getTask().autorun;
                if (autorun) {
                    godGuide.touchSimulation(node);
                }
            });
        })
    }

    //文本指令
    static async text(godGuide, step) {
        let { args } = step.command;
        if (args && (typeof args === 'string' || typeof args === 'number')) {
            args = [args];
        }

        //触摸模拟
        let autorun = godGuide.getTask().autorun;

        for (let i = 0; i < args.length; i++) {
            let str = args[i]
            await new Promise((resolve, reject) => {
                godGuide.showText(str, ()=>{
                    resolve()
                })
                //自动引导
                if (autorun) {
                    setTimeout(() => {
                        resolve()
                    }, 1000);
                }
            })
        }
    }

    //对话框
    static async dialogue(godGuide, step) {
        let { args } = step.command;
        if (args && (typeof args === 'string' || typeof args === 'number')) {
            args = [args];
        }

        //触摸模拟
        let autorun = godGuide.getTask().autorun;

        for (let i = 0; i < args.length; i++) {
            let str = args[i]
            await new Promise((resolve, reject) => {
                
                godGuide.showDialogue(str, () => {//点击回调
                    resolve()
                });

                //自动引导
                if (autorun) {
                    setTimeout(() => {
                        resolve()
                    }, 1000);
                }
            })
        }
        godGuide._dialogue.active = false;
    }

};