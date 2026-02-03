    animate() {
        requestAnimationFrame(() => this.animate());
        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // ... lógica de input y player ...

        this.dayNight.update(dt, this.world.skyDome);
        this.world.update(dt, time, this.player.getPosition());
        this.soundManager.update(this.dayNight.time);
        this.ecoSystem.update(time, this.input);
        
        // --- ACTUALIZACIÓN DE RED ---
        this.networkManager.sendPosition(this.player.getPosition());
        this.networkManager.update(dt); // <--- AÑADIR ESTA LÍNEA
        // ---------------------------
        
        this.composer.render();
    }
