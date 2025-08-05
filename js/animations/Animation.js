// Прототипный класс, на основе которого созданые все анимации
export class Animation {
    constructor(params = {}) {
        this.cache = {};
        this.params = params;
        this.enabled = false;
        this.initialized = false;
        this.enabledRoutes = this.params.enabledRoutes || [];
        this.currentRoute = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    //init = () => {};

    enable = (route) => {
        this.currentRoute = route;

        if (!this.initialized) {
            this.init();
        }

        this.enabled = true;
    };

    disable = () => {
        this.enabled = false;
    };

    autoToggle = (route) => {
        if (this.enabledRoutes.includes(route) || this.enabledRoutes.includes('*')) {
            this.enable(route);
            return;
        }

        this.disable();
    };

    // Проверка именованного закешированного значения в классе, чтобы предотвратить лишние обновления DOM и снизить нагрузку
    needsUpdate = (key, value) => {
        if (this.cache[key] === value) return false;

        this.cache[key] = value;

        return true;
    };

    resize = (w, h) => {
        if (!w || !h) {
            console.error('Width and height required in resize method');
        }

        this.width = w;
        this.height = h;
    }

    // В данном методе необходимо высчитывать состояние анимации, читать значения из DOM и никогда не вносить изменения в DOM
    update = () => {
        if (!this.initialized || !this.enabled) return;
    };

    // Данный метод вызывается через requestAnimationFrame для обновления DOM. Здесь нужно только вносить изменния в DOM и никогда не читать из DOM
    render = (delta) => {
        if (!this.initialized || !this.enabled) return;
    };
}
