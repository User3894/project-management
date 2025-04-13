document.addEventListener('DOMContentLoaded', () => {
    // --- الحصول على عناصر DOM ---
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.getElementById('content-area');

    // عناصر قسم الموظفين
    const addEmployeeForm = document.getElementById('add-employee-form');
    const employeeNameInput = document.getElementById('employee-name');
    const employeeDepartmentInput = document.getElementById('employee-department');
    const employeeList = document.getElementById('employee-list');
    const totalEmployeesStat = document.getElementById('total-employees');

    // عناصر قسم المشاريع
    const addProjectForm = document.getElementById('add-project-form');
    const projectNameInput = document.getElementById('project-name');
    const projectStatusInput = document.getElementById('project-status');
    const projectList = document.getElementById('project-list');
    const totalProjectsStat = document.getElementById('total-projects');

    // --- مخزن البيانات (باستخدام localStorage للمحافظة على البيانات بعد إغلاق المتصفح) ---
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    // --- وظائف التحديث والعرض ---

    // تحديث قائمة الموظفين في الواجهة
    function renderEmployees() {
        employeeList.innerHTML = ''; // مسح القائمة الحالية
        employees.forEach((employee, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <span>الاسم:</span> ${employee.name} - <span>القسم:</span> ${employee.department}
                </div>
                <button class="delete-button" data-index="${index}">حذف</button>
            `;
            employeeList.appendChild(li);
        });
        updateStats(); // تحديث الإحصائيات
        addDeleteEventListeners('employee'); // إضافة مستمعي حدث الحذف
    }

    // تحديث قائمة المشاريع في الواجهة
    function renderProjects() {
        projectList.innerHTML = ''; // مسح القائمة الحالية
        projects.forEach((project, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <span>المشروع:</span> ${project.name} - <span>الحالة:</span> ${project.status}
                 </div>
                 <button class="delete-button" data-index="${index}">حذف</button>
            `;
             // تغيير لون الشريط الجانبي بناءً على الحالة (اختياري)
            switch (project.status) {
                case 'مكتمل':
                    li.style.borderLeftColor = 'var(--secondary-color)'; // أخضر
                    break;
                case 'قيد التنفيذ':
                     li.style.borderLeftColor = '#f39c12'; // برتقالي
                    break;
                case 'متوقف':
                    li.style.borderLeftColor = 'var(--danger-color)'; // أحمر
                    break;
                default: // جديد
                    li.style.borderLeftColor = 'var(--primary-color)'; // أزرق
            }
            projectList.appendChild(li);
        });
        updateStats(); // تحديث الإحصائيات
        addDeleteEventListeners('project'); // إضافة مستمعي حدث الحذف
    }

    // تحديث الإحصائيات في لوحة التحكم
    function updateStats() {
        totalEmployeesStat.textContent = employees.length;
        totalProjectsStat.textContent = projects.length;
    }

    // حفظ البيانات في localStorage
    function saveData() {
        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // --- وظائف الحذف ---
    function addDeleteEventListeners(type) {
        const deleteButtons = document.querySelectorAll(`#${type}-list .delete-button`);
        deleteButtons.forEach(button => {
            // إزالة أي مستمع قديم لمنع التكرار
            button.replaceWith(button.cloneNode(true));
        });
        // إضافة المستمع الجديد
        const newDeleteButtons = document.querySelectorAll(`#${type}-list .delete-button`);
        newDeleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index, 10);
                if (type === 'employee') {
                    deleteEmployee(index);
                } else if (type === 'project') {
                    deleteProject(index);
                }
            });
        });
    }

    function deleteEmployee(index) {
        if (confirm(`هل أنت متأكد من حذف الموظف: ${employees[index].name}؟`)) {
            employees.splice(index, 1); // إزالة من المصفوفة
            saveData();
            renderEmployees();
        }
    }

    function deleteProject(index) {
         if (confirm(`هل أنت متأكد من حذف المشروع: ${projects[index].name}؟`)) {
            projects.splice(index, 1); // إزالة من المصفوفة
            saveData();
            renderProjects();
         }
    }


    // --- التعامل مع النماذج ---

    // إضافة موظف جديد
    addEmployeeForm.addEventListener('submit', (e) => {
        e.preventDefault(); // منع الإرسال الافتراضي للنموذج
        const name = employeeNameInput.value.trim();
        const department = employeeDepartmentInput.value.trim();

        if (name && department) {
            employees.push({ name, department });
            saveData(); // حفظ البيانات
            renderEmployees(); // إعادة عرض القائمة
            employeeNameInput.value = ''; // مسح الحقول
            employeeDepartmentInput.value = '';
        } else {
            alert('يرجى ملء جميع حقول الموظف.');
        }
    });

    // إضافة مشروع جديد
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = projectNameInput.value.trim();
        const status = projectStatusInput.value;

        if (name) {
            projects.push({ name, status });
            saveData();
            renderProjects();
            projectNameInput.value = '';
            projectStatusInput.value = 'جديد'; // إعادة التعيين للقيمة الافتراضية
        } else {
            alert('يرجى إدخال اسم المشروع.');
        }
    });

    // --- منطق التنقل بين الأقسام ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.dataset.section + '-section';

            // إزالة كلاس 'active' من جميع الأزرار والأقسام
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // إضافة كلاس 'active' للزر والقسم المستهدف
            button.classList.add('active');
            document.getElementById(targetSectionId).classList.add('active');
        });
    });

    // --- إعداد Three.js ---
    const threeContainer = document.getElementById('threejs-container');
    let scene, camera, renderer, cube;

    function initThreeJS() {
        // 1. المشهد (Scene)
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x3498db); // لون خلفية متناسق مع الهيدر

        // 2. الكاميرا (Camera)
        const aspect = threeContainer.clientWidth / threeContainer.clientHeight;
        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 2; // تقريب الكاميرا قليلاً

        // 3. العارض (Renderer)
        renderer = new THREE.WebGLRenderer({ antialias: true }); // تفعيل تنعيم الحواف
        renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
        threeContainer.appendChild(renderer.domElement); // إضافة الكانفاس إلى الحاوية

        // 4. الشكل الهندسي (Geometry) والمادة (Material) والكائن (Mesh)
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // مكعب أصغر قليلاً
        // مادة تتفاعل مع الضوء (تحتاج لإضاءة)
        // const material = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.5, metalness: 0.5 });
        // مادة بسيطة لا تحتاج لإضاءة (أسهل للبداية)
         const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); // أبيض وهيكلي

        cube = new THREE.Mesh(geometry, material);
        scene.add(cube); // إضافة المكعب للمشهد

        // 5. الإضاءة (اختياري إذا استخدمت MeshBasicMaterial، ضروري لـ MeshStandardMaterial)
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // ضوء محيطي خافت
        // scene.add(ambientLight);
        // const pointLight = new THREE.PointLight(0xffffff, 0.8); // ضوء نقطي
        // pointLight.position.set(2, 3, 4);
        // scene.add(pointLight);


        // بدء حلقة الرسوم المتحركة
        animateThreeJS();
    }

    // حلقة الرسوم المتحركة
    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS); // طلب الإطار التالي

        // تحريك المكعب
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.005;

        // عرض المشهد
        renderer.render(scene, camera);
    }

    // التعامل مع تغيير حجم النافذة أو الحاوية
    function onWindowResize() {
        if (!camera || !renderer) return; // التأكد من أن العناصر مهيأة

        // قد نحتاج إلى إعادة حساب أبعاد الحاوية بشكل ديناميكي إذا تغيرت
        const width = threeContainer.clientWidth;
        const height = threeContainer.clientHeight;

        if (width > 0 && height > 0) { // التأكد من أن الأبعاد صالحة
            camera.aspect = width / height;
            camera.updateProjectionMatrix(); // تحديث مصفوفة عرض الكاميرا
            renderer.setSize(width, height); // تحديث حجم العارض
        }
    }

    // ربط مستمع حدث تغيير الحجم
    window.addEventListener('resize', onWindowResize, false);

    // --- التشغيل الأولي ---
    renderEmployees(); // عرض الموظفين عند التحميل
    renderProjects(); // عرض المشاريع عند التحميل
    updateStats(); // تحديث الإحصائيات عند التحميل
    initThreeJS(); // تهيئة وإطلاق Three.js
    // تأكد من أن القسم الافتراضي (لوحة التحكم) هو النشط
    document.getElementById('dashboard-section').classList.add('active');
    document.querySelector('.nav-button[data-section="dashboard"]').classList.add('active');


});
