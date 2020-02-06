import GodGuide from "./GodGuide";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LoadGuide extends cc.Component {

    //显示的文本
    callback: any;


    @property(cc.Prefab)
    PREFAB: cc.Prefab = null; //预制件

    @property(cc.Node)
    parent: cc.Node = null;  //预制件实例化后所在的父节点

    @property()
    zIndex = 0;

    @property([cc.String])
    tasks: string[] = []

    _godGuide: GodGuide;

    onLoad() {
        if (!CC_EDITOR) {
            this.loadPrefab();
        }
    }

    start() {
        this.runTask();
    }

    loadPrefab() {
        try {
            let node = cc.instantiate(this.PREFAB);
            node.zIndex = this.zIndex;
            node.position = cc.v2(0, 0);
            //不持久化到编辑器
            // node._objFlags = cc.Object.Flags.DontSave;
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent('GodGuide');
        }
        catch (error) {
            cc.error(this.PREFAB);
            cc.error(error);
        }
    }

    async runTask() {

        for (let i = 0; i < this.tasks.length; i++) {
            let taskFile = this.tasks[i]
            console.log('taskFile---------->', taskFile)
            let task = require(taskFile).task
            if (!task) {
                console.log('[BUG] 引导配置读取错误', taskFile)
            }
            this._godGuide.setTask(task)
            await this._godGuide.run()
            console.log('完成引导任务', task.name)
        }
    }
    
}
