export class Input {
    constructor() {
        this.keys = { forward: false, backward: false, left: false, right: false, space: false, shift: false, action: false };
        this.joystick = { x: 0, y: 0 };
        this.look = { x: 0, y: 0 };
        this.jumpPressedCount = 0;
        this.setupKeyboard();
        this.setupMouse();
        this.setupTouch();
    }
    setupKeyboard() {
        document.addEventListener('keydown', (e) => this.onKey(e, true));
        document.addEventListener('keyup', (e) => this.onKey(e, false));
    }
    onKey(e, isDown) {
        switch (e.code) {
            case 'KeyW': this.keys.forward = isDown; break;
            case 'KeyS': this.keys.backward = isDown; break;
            case 'KeyA': this.keys.left = isDown; break;
            case 'KeyD': this.keys.right = isDown; break;
            case 'ShiftLeft': this.keys.shift = isDown; break;
            case 'KeyE': this.keys.action = isDown; break;
            case 'Space': 
                if (!isDown) this.keys.space = false;
                else {
                    if (!this.keys.space) this.jumpPressedCount++;
                    this.keys.space = true;
                }
                break;
        }
    }
    setupMouse() {
        document.body.addEventListener('click', () => { if (!this.isMobile()) document.body.requestPointerLock(); });
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) { this.look.x = e.movementX; this.look.y = e.movementY; }
        });
    }
    setupTouch() {
        const zone = document.getElementById('joystick-zone');
        const knob = document.getElementById('joystick-knob');
        let startX, startY;
        zone.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY; }, { passive: false });
        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            const dx = t.clientX - startX, dy = t.clientY - startY;
            const dist = Math.min(Math.hypot(dx, dy), 50);
            const angle = Math.atan2(dy, dx);
            knob.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px))`;
            this.joystick.x = (Math.cos(angle)*dist)/50; this.joystick.y = (Math.sin(angle)*dist)/50;
        }, { passive: false });
        const reset = () => { knob.style.transform = `translate(-50%, -50%)`; this.joystick.x=0; this.joystick.y=0; };
        zone.addEventListener('touchend', reset); zone.addEventListener('touchcancel', reset);

        const camZone = document.getElementById('camera-touch-zone');
        let lastTX, lastTY;
        camZone.addEventListener('touchstart', (e) => { lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY; }, {passive: false});
        camZone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            this.look.x = (t.clientX - lastTX) * 1.5; this.look.y = (t.clientY - lastTY) * 1.5;
            lastTX = t.clientX; lastTY = t.clientY;
        }, {passive: false});
        
        document.getElementById('btn-jump').addEventListener('touchstart', (e) => { e.preventDefault(); this.jumpPressedCount++; this.keys.space = true; });
        document.getElementById('btn-jump').addEventListener('touchend', (e) => { e.preventDefault(); this.keys.space = false; });
        document.getElementById('btn-action').addEventListener('touchstart', (e) => { e.preventDefault(); this.keys.action = true; });
        document.getElementById('btn-action').addEventListener('touchend', (e) => { e.preventDefault(); this.keys.action = false; });
    }
    getLookDelta() { const l = { ...this.look }; this.look.x = 0; this.look.y = 0; return l; }
    isMobile() { return /Android|iPhone/i.test(navigator.userAgent); }
}
