// hexagon-bg.js - 可复用的六边形网格动画背景

class HexagonBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            side: 25,
            picksParTick: 2,
            baseTime: 40,
            addedTime: 10,
            colors: ['rgba(180,30,30,alp)', 'rgba(255,255,255,alp)'],
            strokeColor: 'rgb(100,0,0)',
            repaintAlpha: 1,
            hueSpeed: 0.4
        }, options);
        
        this.init();
    }
    
    init() {
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        
        // 设置canvas样式
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '0';
        
        // 设置container样式
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        
        // 获取绘图上下文
        this.ctx = this.canvas.getContext('2d');
        
        // 计算六边形参数
        this.calculateHexParams();
        
        // 初始化六边形网格
        this.resize();
        
        // 启动动画循环
        this.loop();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
    }
    
    calculateHexParams() {
        const opts = this.options;
        this.difX = Math.sqrt(3) * opts.side / 2;
        this.difY = opts.side * 3 / 2;
        this.rad = Math.PI / 6;
        this.cos = Math.cos(this.rad) * opts.side;
        this.sin = Math.sin(this.rad) * opts.side;
    }
    
    resize() {
        // 设置canvas尺寸为容器大小
        const rect = this.container.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
        
        // 重新创建六边形网格
        this.createHexGrid();
    }
    
    createHexGrid() {
        this.hexs = [];
        const opts = this.options;
        
        // 创建超出容器边界的六边形，确保完整覆盖
        for (let x = -this.difX; x < this.width + this.difX; x += this.difX * 2) {
            let i = 0;
            for (let y = -opts.side; y < this.height + opts.side; y += this.difY) {
                i++;
                this.hexs.push(new Hex(x + this.difX * (i % 2), y, this));
            }
        }
    }
    
    loop() {
        this.tick = (this.tick || 0) + this.options.hueSpeed;
        
        // 半透明填充，产生拖尾效果
        this.ctx.fillStyle = `rgba(0,0,0,${this.options.repaintAlpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 随机选中六边形
        for (let i = 0; i < this.options.picksParTick; i++) {
            const randomIndex = Math.floor(Math.random() * this.hexs.length);
            this.hexs[randomIndex].pick();
        }
        
        // 更新所有六边形
        this.hexs.forEach(hex => hex.step());
        
        // 继续动画循环
        this.animationId = requestAnimationFrame(() => this.loop());
    }
    
    // 停止动画并清理资源
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        window.removeEventListener('resize', () => this.resize());
    }
}

// 六边形类
class Hex {
    constructor(x, y, hexBg) {
        this.x = x;
        this.y = y;
        this.hexBg = hexBg;
        this.picked = false;
        this.time = 0;
        this.targetTime = 0;
        
        // 计算六边形六个顶点坐标
        this.calculateVertices();
    }
    
    calculateVertices() {
        const { x, y, hexBg } = this;
        const { cos, sin, options } = hexBg;
        
        this.xs = [
            x + cos,
            x,
            x - cos,
            x - cos,
            x,
            x + cos
        ];
        
        this.ys = [
            y - sin,
            y - options.side,
            y - sin,
            y + sin,
            y + options.side,
            y + sin
        ];
    }
    
    pick() {
        const { options } = this.hexBg;
        this.color = options.colors[Math.floor(Math.random() * options.colors.length)];
        this.picked = true;
        this.time = 0;
        this.targetTime = Math.floor(options.baseTime + options.addedTime * Math.random());
    }
    
    step() {
        const { ctx, options } = this.hexBg;
        const prop = this.time / this.targetTime;
        
        // 绘制六边形
        ctx.beginPath();
        ctx.moveTo(this.xs[0], this.ys[0]);
        
        for (let i = 1; i < this.xs.length; i++) {
            ctx.lineTo(this.xs[i], this.ys[i]);
        }
        
        ctx.closePath();
        
        if (this.picked) {
            this.time++;
            
            // 检查动画是否结束
            if (this.time >= this.targetTime) {
                this.picked = false;
            }
            
            // 设置填充颜色，使用正弦函数产生平滑的透明度变化
            ctx.fillStyle = this.color.replace('alp', Math.sin(prop * Math.PI));
            ctx.fill();
        } else {
            // 未选中状态绘制描边
            ctx.strokeStyle = options.strokeColor;
            ctx.stroke();
        }
    }
}

// 导出模块（支持ES6模块和CommonJS）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagonBackground;
} else if (typeof window !== 'undefined') {
    window.HexagonBackground = HexagonBackground;
}
