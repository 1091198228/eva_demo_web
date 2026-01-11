// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 作品概览轮播功能
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');

    let currentIndex = 0;
    const itemWidth = carouselItems[0].offsetWidth;
    const totalItems = carouselItems.length;

    // 更新轮播位置
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // 更新指示器
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // 下一个作品
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    // 上一个作品
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // 点击指示器切换作品
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // 左右按钮事件监听
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 响应式调整
    window.addEventListener('resize', () => {
        // 重新计算宽度
        const newItemWidth = carouselItems[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentIndex * newItemWidth}px)`;
    });

    // 自动轮播
    let autoPlay = setInterval(nextSlide, 5000);

    // 鼠标悬停时停止自动轮播
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });

    // 鼠标离开时恢复自动轮播
    carouselContainer.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 5000);
    });

    // 移动端菜单
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const navMobile = document.getElementById('nav-mobile');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', function () {
        navMobile.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenuHandler() {
        navMobile.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeMenu.addEventListener('click', closeMenuHandler);
    overlay.addEventListener('click', closeMenuHandler);

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // 关闭移动菜单（如果打开）
            closeMenuHandler();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // "开始探索"按钮平滑滚动到作品概览
    const startExploringBtn = document.getElementById('start-exploring');
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', function () {
            const overviewSection = document.getElementById('overview');
            if (overviewSection) {
                window.scrollTo({
                    top: overviewSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // 背景音乐控制
    const backgroundMusic = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const musicIcon = document.getElementById('music-icon');

    if (backgroundMusic && musicControl && musicIcon) {
        // 点击控制按钮切换播放/暂停
        musicControl.addEventListener('click', function () {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(error => {
                    console.log('播放音乐失败:', error);
                });
                musicIcon.classList.remove('fa-volume-mute');
                musicIcon.classList.add('fa-volume-up');
            } else {
                backgroundMusic.pause();
                musicIcon.classList.remove('fa-volume-up');
                musicIcon.classList.add('fa-volume-mute');
            }
        });

        // 页面加载时显示静音图标（默认不播放）
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-volume-mute');
    }

    // GSAP自定义文本乱序加载特效
    const scrambleTextElement = document.getElementById('scramble-text');
    if (scrambleTextElement) {
        const originalText = scrambleTextElement.textContent;
        const chars = originalText.split('');

        // 创建一个用于显示当前文本的数组
        let currentText = chars.map(char => {
            // 对中文字符使用随机中文字符，对其他字符使用随机字母数字
            if (char.match(/[\u4e00-\u9fa5]/)) {
                // 随机中文字符
                return String.fromCharCode(Math.floor(Math.random() * (0x9fa5 - 0x4e00 + 1)) + 0x4e00);
            } else if (char.match(/[a-zA-Z0-9]/)) {
                // 随机字母数字
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                return chars[Math.floor(Math.random() * chars.length)];
            } else {
                // 保留标点符号和空格
                return char;
            }
        });

        // 创建一个索引数组，表示每个字符应该在何时转换为正确字符
        const revealIndices = chars.map((_, index) => index);

        // 打乱索引顺序
        revealIndices.sort(() => Math.random() - 0.5);

        // 设置动画时长和延迟
        const duration = 2;
        const totalChars = chars.length;

        // 使用GSAP的to方法来控制动画进度
        gsap.to({}, {
            duration: duration,
            ease: 'power2.out',
            onUpdate: function () {
                // 根据当前进度计算应该显示多少个正确字符
                const progress = this.progress();
                const charsToReveal = Math.floor(progress * totalChars);

                // 更新当前文本数组
                for (let i = 0; i < charsToReveal; i++) {
                    const index = revealIndices[i];
                    currentText[index] = chars[index];
                }

                // 更新剩余字符为随机字符
                for (let i = charsToReveal; i < totalChars; i++) {
                    const index = revealIndices[i];
                    if (chars[index].match(/[\u4e00-\u9fa5]/)) {
                        currentText[index] = String.fromCharCode(Math.floor(Math.random() * (0x9fa5 - 0x4e00 + 1)) + 0x4e00);
                    } else if (chars[index].match(/[a-zA-Z0-9]/)) {
                        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        currentText[index] = randomChars[Math.floor(Math.random() * randomChars.length)];
                    }
                }

                // 更新显示的文本
                scrambleTextElement.textContent = currentText.join('');
            },
            onComplete: function () {
                // 确保最终显示的是完整的原始文本
                scrambleTextElement.textContent = originalText;
            }
        });
    }

    // 滚动动画
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;

            if (isVisible) {
                element.classList.add('active');
            }
        });
    }

    // 初始检查
    checkFade();

    // 滚动时检查
    window.addEventListener('scroll', checkFade);

    // 同步率测试
    const startTestBtn = document.getElementById('start-test');
    const testQuestion = document.getElementById('test-question');
    const testOptions = document.getElementById('test-options');
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-bar').previousElementSibling.querySelector('span:last-child');

    // 测试问题
    const questions = [
        {
            question: "当你面对强大的敌人时，你会怎么做？",
            options: [
                "冷静分析，寻找弱点",
                "凭借直觉和勇气战斗",
                "遵循命令，执行任务",
                "寻求同伴的帮助"
            ],
            scores: [1, 3, 2, 4]
        },
        {
            question: "你如何看待自己的过去？",
            options: [
                "过去的痛苦让我变得更强",
                "我尽量不去想它",
                "过去塑造了现在的我",
                "我希望能够忘记过去"
            ],
            scores: [3, 2, 4, 1]
        },
        {
            question: "在团队中，你通常扮演什么角色？",
            options: [
                "领导者，做出决策",
                "执行者，完成任务",
                "思考者，提供建议",
                "协调者，维护团队关系"
            ],
            scores: [3, 2, 1, 4]
        },
        {
            question: "当你感到压力很大时，你会怎么做？",
            options: [
                "独自冷静思考",
                "与信任的人交流",
                "专注于工作分散注意力",
                "通过运动或其他活动释放压力"
            ],
            scores: [1, 4, 2, 3]
        },
        {
            question: "你认为什么是最重要的？",
            options: [
                "完成自己的使命",
                "保护重要的人",
                "探索真相",
                "寻找自己存在的意义"
            ],
            scores: [2, 4, 1, 3]
        }
    ];

    let currentQuestion = 0;
    let totalScore = 0;

    startTestBtn.addEventListener('click', startTest);

    function startTest() {
        currentQuestion = 0;
        totalScore = 0;
        showQuestion(currentQuestion);
        updateProgress(0);
    }

    function showQuestion(index) {
        const question = questions[index];
        testQuestion.innerHTML = `<h3 class="text-2xl font-bold mb-6 text-gray-100">${question.question}</h3>`;
        testOptions.innerHTML = '';

        question.options.forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'card p-4 cursor-pointer hover:bg-gray-700 transition-colors';
            optionDiv.innerHTML = `<p class="text-gray-200">${option}</p>`;
            optionDiv.addEventListener('click', () => selectOption(i));
            testOptions.appendChild(optionDiv);
        });

        testOptions.classList.remove('hidden');
    }

    function selectOption(optionIndex) {
        totalScore += questions[currentQuestion].scores[optionIndex];
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
            updateProgress((currentQuestion / questions.length) * 100);
        } else {
            showResult();
            updateProgress(100);
        }
    }

    function showResult() {
        testOptions.classList.add('hidden');

        let result = '';
        let character = '';
        let image = '';
        let description = '';

        // 根据得分确定结果
        if (totalScore <= 8) {
            character = "绫波丽";
            image = "https://p26-doubao-search-sign.byteimg.com/labis/f9a675b66d0802fa7f8cea7bf022647b~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1783616614&x-signature=gkFCgt0PmHJ5c1rX0RjAip1wn3A%3D";
            description = "你与绫波丽的同步率最高。你冷静、理性，能够在压力下保持镇定。你可能看起来有些冷漠，但内心深处有着强烈的情感。";
        } else if (totalScore <= 12) {
            character = "碇真嗣";
            image = "https://p11-doubao-search-sign.byteimg.com/labis/3720ff756ae61d157dd48ec801704d91~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1783616614&x-signature=RBJ96faA9wyNpdCbrWNJtlQWm9c%3D";
            description = "你与碇真嗣的同步率最高。你敏感、内向，常常质疑自己的能力。但在关键时刻，你能够展现出惊人的勇气和毅力。";
        } else if (totalScore <= 16) {
            character = "明日香";
            image = "https://p11-doubao-search-sign.byteimg.com/tos-cn-i-xv4ileqgde/40f39df448174b9b98142ac2bcb8a2c0~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1783616614&x-signature=mrw8T6Vppsv9z6vFrzHrX3VlAN4%3D";
            description = "你与明日香的同步率最高。你自信、好胜，有着强烈的自尊心。你追求完美，不愿示弱，但内心也有脆弱的一面。";
        } else {
            character = "渚薰";
            image = "https://p3-doubao-search-sign.byteimg.com/tos-cn-i-xv4ileqgde/cac278237dcc46fa90f79e3e3ba18f45~tplv-be4g95zd3a-image.jpeg?lk3s=feb11e32&x-expires=1783616614&x-signature=fn%2FPafy6YX7rjY6aG425xGB8GUU%3D";
            description = "你与渚薰的同步率最高。你神秘、温和，有着超越年龄的成熟。你善于理解他人，能够看到事物的本质，但也常常感到孤独。";
        }

        const syncRate = Math.floor(Math.random() * 30) + 70; // 70-100之间的随机数

        result = `
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4 text-gray-100">测试结果</h3>
                <div class="mb-6">
                    <img src="${image}" alt="${character}" class="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-accent">
                    <h4 class="text-xl font-bold mb-2">${character}</h4>
                    <p class="text-3xl font-bold mb-2 glow">${syncRate}%</p>
                    <p class="text-gray-300 mb-6">同步率</p>
                </div>
                <p class="text-gray-300 mb-8">${description}</p>
                <button id="restart-test" class="btn-primary px-6 py-3 rounded-md text-white font-medium">重新测试</button>
            </div>
        `;

        testQuestion.innerHTML = result;

        document.getElementById('restart-test').addEventListener('click', startTest);
    }

    function updateProgress(percentage) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}%`;
    }

    // 3D模型加载和渲染
    function init3DModel() {
        console.log('Three.js版本:', THREE.REVISION);
        console.log('THREE.GLTFLoader是否存在:', typeof THREE.GLTFLoader);
        console.log('THREE.OrbitControls是否存在:', typeof THREE.OrbitControls);

        const container = document.getElementById('eva-model');
        if (!container) return;

        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa3a3a3);

        // 创建相机
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5; // 增加z值，从更前方俯视




        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // 1. 环境光：均匀照亮整个场景，消除纯黑区域，避免模型局部“透光发黑”
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // 第二个参数是光照强度（0-1）
        scene.add(ambientLight);

        // 2. 方向光：模拟太阳光，提供主光源，增强立体感，解决“灰蒙蒙透明感”
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 7.5); // 调整光源位置，避免正面直射导致平淡
        directionalLight.castShadow = true; // 可选：开启阴影，进一步增强质感
        scene.add(directionalLight);

        // 可选：补充点光源，照亮模型细节，彻底解决局部透明感
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-5, -5, 5);
        scene.add(pointLight);

        // 初始化OrbitControls
        let controls;
        if (typeof THREE.OrbitControls === 'function') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            // 配置控制选项
            controls.enableDamping = true; // 启用阻尼效果
            controls.dampingFactor = 0.05; // 阻尼系数
            controls.enableZoom = true; // 启用缩放
            controls.enablePan = true; // 启用平移
            controls.minDistance = 50; // 最小相机距离
            controls.maxDistance = 300; // 最大相机距离
            controls.minPolarAngle = 0; // 最小极角
            controls.maxPolarAngle = Math.PI / 2; // 最大极角 (90度)
            controls.target.set(0, 0, 0); // 控制目标
            controls.update(); // 更新控制器状态
        } else {
            console.error('OrbitControls不可用，请检查OrbitControls的引入');
        }

        // 加载GLB模型
        if (typeof THREE.GLTFLoader === 'function') {
            const loader = new THREE.GLTFLoader();
            loader.load(
                './3d/1.glb',
                function (gltf) {
                    const model = gltf.scene;

                    // 设置模型位置和缩放
                    model.position.set(0, -35, 0);
                    model.scale.set(0.5, 0.5, 0.5);

                    // 添加模型到场景
                    scene.add(model);

                    // 主动画循环
                    function animate() {
                        requestAnimationFrame(animate);

                        // 更新控制器
                        if (controls) controls.update();

                        renderer.render(scene, camera);
                    }

                    animate();
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.error('加载模型时出错:', error);
                }
            );
        } else {
            console.error('GLTFLoader不可用，请检查Three.js和GLTFLoader的引入');
        }

        // 响应窗口大小变化
        window.addEventListener('resize', function () {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // 初始化3D模型
    init3DModel();

    // 导航栏滚动效果
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('bg-gray-900');
            header.classList.remove('bg-opacity-90');
        } else {
            header.classList.remove('bg-gray-900');
            header.classList.add('bg-opacity-90');
        }
    });

    // 导航链接激活状态（滚动时）
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];

    // 获取所有目标 section 元素
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const section = document.querySelector(targetId);
            if (section) {
                sections.push({
                    id: targetId,
                    element: section
                });
            }
        }
    });

    // 监听滚动事件
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + 100; // 添加偏移量，让激活状态更早出现

        // 移除所有链接的激活状态
        navLinks.forEach(link => link.classList.remove('active'));

        // 查找当前滚动位置对应的 section
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element.offsetTop <= scrollPosition) {
                // 为对应的导航链接添加激活状态
                const activeLink = document.querySelector(`.nav-link[href="${section.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                break;
            }
        }
    });

    // 初始加载时检查当前位置
    window.dispatchEvent(new Event('scroll'));


});