/**
 * CYONI MASCOT LIBRARY v3.0 - Ultimate API
 * * A fully procedural, canvas-based anime character for web branding.
 * Designed for maximum flexibility and developer control.
 */

(function (global) {

    // -----------------------------------------------------------
    // 1. MATH & UTILS
    // -----------------------------------------------------------

    const FastSimplex = (function () {
        var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        var Perm = new Uint8Array(512);
        var Grad = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]];
        function FastSimplex() { for (var i = 0; i < 512; i++) Perm[i] = Math.floor(Math.random() * 255) & 255; }
        FastSimplex.prototype.noise2D = function (xin, yin) {
            var n0, n1, n2;
            var s = (xin + yin) * F2;
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var t = (i + j) * G2;
            var X0 = i - t;
            var Y0 = j - t;
            var x0 = xin - X0;
            var y0 = yin - Y0;
            var i1, j1;
            if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
            var x1 = x0 - i1 + G2;
            var y1 = y0 - j1 + G2;
            var x2 = x0 - 1.0 + 2.0 * G2;
            var y2 = y0 - 1.0 + 2.0 * G2;
            var ii = i & 255;
            var jj = j & 255;
            var gi0 = Perm[ii + Perm[jj]] % 12;
            var gi1 = Perm[ii + i1 + Perm[jj + j1]] % 12;
            var gi2 = Perm[ii + 1 + Perm[jj + 1]] % 12;
            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) n0 = 0.0;
            else { t0 *= t0; n0 = t0 * t0 * (Grad[gi0][0] * x0 + Grad[gi0][1] * y0); }
            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) n1 = 0.0;
            else { t1 *= t1; n1 = t1 * t1 * (Grad[gi1][0] * x1 + Grad[gi1][1] * y1); }
            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) n2 = 0.0;
            else { t2 *= t2; n2 = t2 * t2 * (Grad[gi2][0] * x2 + Grad[gi2][1] * y2); }
            return 70.0 * (n0 + n1 + n2);
        };
        return FastSimplex;
    })();

    function lerp(start, end, t) { return start * (1 - t) + end * t; }

    function getLines(ctx, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) { currentLine += " " + word; }
            else { lines.push(currentLine); currentLine = word; }
        }
        lines.push(currentLine);
        return lines;
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // -----------------------------------------------------------
    // 2. INTERNAL COMPONENT: HAIR
    // -----------------------------------------------------------

    class HairRibbon {
        constructor(angle, length, width, type, simplex) {
            this.angle = angle;
            this.length = length;
            this.width = width;
            this.type = type;
            this.nodes = [];
            this.noiseOffset = Math.random() * 1000;
            this.simplex = simplex;
            let segments = 6;
            for (let i = 0; i < segments; i++) this.nodes.push({ x: 0, y: 0 });
        }

        update(headX, headY, currentLookX, tilt, time, canvasWidth) {
            let rad = 75;
            if (this.type === 'bangs') rad = 66;

            let rX = headX + Math.cos(this.angle + tilt) * rad;
            let rY = headY + Math.sin(this.angle + tilt) * rad;
            if (this.type === 'bangs') rY += 16;

            this.nodes[0] = { x: rX, y: rY };

            for (let i = 1; i < this.nodes.length; i++) {
                let prev = this.nodes[i - 1];
                let flowAngle = this.angle + tilt;

                if (this.type !== 'bangs') flowAngle = lerp(flowAngle, Math.PI / 2, i * 0.15);

                let noiseAmp = (this.type === 'bangs') ? 0.5 : 1.5;
                let nX = this.simplex.noise2D(i * 0.3, time * 0.3 + this.noiseOffset) * (i * noiseAmp);
                let nY = this.simplex.noise2D(i * 0.3 + 100, time * 0.3 + this.noiseOffset) * (i * 1);

                let lag = (currentLookX - canvasWidth / 2) * -0.005 * i;

                let segLen = this.length / this.nodes.length;
                this.nodes[i].x = lerp(this.nodes[i].x, prev.x + Math.cos(flowAngle) * segLen + nX + lag, 0.4);
                this.nodes[i].y = lerp(this.nodes[i].y, prev.y + Math.sin(flowAngle) * segLen + nY, 0.4);
            }
        }

        draw(ctx, colors) {
            let leftPts = [];
            let rightPts = [];
            for (let i = 0; i < this.nodes.length; i++) {
                let n = this.nodes[i];
                let w = this.width * (1 - (i / (this.nodes.length - 0.5)));
                if (this.type === 'back') w *= 1.2;
                leftPts.push({ x: n.x - w, y: n.y });
                rightPts.push({ x: n.x + w, y: n.y });
            }

            ctx.beginPath();
            ctx.moveTo(leftPts[0].x, leftPts[0].y);
            for (let i = 0; i < leftPts.length - 1; i++) {
                let xc = (leftPts[i].x + leftPts[i + 1].x) / 2;
                let yc = (leftPts[i].y + leftPts[i + 1].y) / 2;
                ctx.quadraticCurveTo(leftPts[i].x, leftPts[i].y, xc, yc);
            }
            let tip = this.nodes[this.nodes.length - 1];
            ctx.lineTo(tip.x, tip.y);
            for (let i = rightPts.length - 2; i >= 0; i--) {
                let xc = (rightPts[i].x + rightPts[i + 1].x) / 2;
                let yc = (rightPts[i].y + rightPts[i + 1].y) / 2;
                ctx.quadraticCurveTo(rightPts[i + 1].x, rightPts[i + 1].y, xc, yc);
            }
            ctx.closePath();

            let grad = ctx.createLinearGradient(this.nodes[0].x, this.nodes[0].y, tip.x, tip.y);
            grad.addColorStop(0, colors.hairHighlight);
            grad.addColorStop(0.2, colors.hairBase);
            grad.addColorStop(1, colors.hairDark);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.strokeStyle = (this.type === 'back') ? colors.lineThin : colors.line;
            ctx.lineWidth = (this.type === 'back') ? 0.5 : 1.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            if (this.type !== 'back') {
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#FFF';
                let hNode = this.nodes[1];
                ctx.beginPath();
                ctx.ellipse(hNode.x, hNode.y, this.width * 0.7, this.width * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }
    }

    // -----------------------------------------------------------
    // 3. MAIN CONTROLLER
    // -----------------------------------------------------------

    const DEFAULT_COLORS = {
        skinBase: '#FFF0E6',
        skinShadow: '#E6C2B0',
        blush: '#FF9E9E',
        hairBase: '#E6E6FA',
        hairDark: '#9B59B6',
        hairHighlight: '#FFFFFF',
        clothesDark: '#482880',
        clothesLight: '#F3E5F5',
        clothesAccent: '#9B59B6',
        pattern1: '#6D214F',
        pattern2: '#58B19F',
        pattern3: '#F1C40F',
        eyeWhite: '#FFFFFF',
        eyeIrisDark: '#8E44AD',
        eyeIrisLight: '#D2B4DE',
        eyePupil: '#2C0E37',
        line: '#2D3436',
        lineThin: 'rgba(155, 89, 182, 0.3)',
        gold: '#F1C40F',
        choker: '#2C0E37',
        redAccent: '#E84118',
        badgeBg: '#2C0E37',
        badgeText: '#F1C40F',
        bubbleBg: '#FFFFFF',
        bubbleBorder: '#8E44AD',
        bubbleText: '#2D3436'
    };

    class CyoniMascot {
        constructor(config) {
            // Default Config
            this.config = Object.assign({
                container: 'body',
                scale: 1.0,
                badgeText: 'CYONI',
                autoResize: true,

                // FEATURE FLAGS (Disable parts completely)
                features: {
                    tracking: true,
                    blinking: true,
                    bobbing: true,
                    speechBubbles: true
                },

                // PHYSICS TUNING
                physics: {
                    bobSpeed: 0.5,       // Slower = more gentle
                    bobAmplitude: 1.0,   // Vertical range
                    trackingSpeed: 0.08, // Higher = snappier eyes
                    blinkInterval: 4000
                },

                // IDLE BEHAVIOR CONFIG
                idle: {
                    enabled: true,
                    intervalMin: 3000,
                    intervalMax: 6000,
                    // Actions allowed in idle loop
                    actions: ['glance', 'blink_flurry', 'tilt', 'mood_shift'],
                    // Moods allowed to be randomly picked
                    allowedMoods: ['happy', 'love', 'smirk']
                },

                // THEME OVERRIDES
                theme: {},

                // EVENTS
                onMoodChange: null,
                onTalkStart: null,
                onTalkEnd: null,
                onIdleAction: null

            }, config);

            this.colors = Object.assign({}, DEFAULT_COLORS, this.config.theme);

            // State
            this.state = {
                baseMood: 'neutral',
                mood: 'neutral',
                trackingMode: 'mouse', // 'mouse', 'fixed'
                targetX: 0,
                targetY: 0,

                mouthScale: 1.5,
                isTalking: false,
                blinkState: 0,
                forceEyesClosed: false,

                // Animation states
                noseShiftX: 0,
                noseShiftY: 0,
                headTilt: 0,

                message: null,
                messageType: 'say',
                messageOpacity: 0,

                lastIdleTime: Date.now()
            };

            // Physics Variables
            this.x = 0; this.y = 0;
            this.width = 0; this.height = 0;
            this.lookX = 0; this.lookY = 0;
            this.headX = 0; this.headY = 0;
            this.bodyX = 0; this.bodyY = 0;
            this.currentTilt = 0;
            this.blinkTimer = 0;
            this.time = 0;

            this.timers = {
                talk: null,
                mood: null,
                gesture: null
            };

            this.simplex = new FastSimplex();
            this.initDOM();
            this.initEvents();
            this.initHair();

            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        initDOM() {
            let container = this.config.container;
            if (typeof container === 'string') {
                container = document.querySelector(container);
            }
            if (!container) throw new Error("CyoniMascot: Container not found.");

            this.canvas = document.createElement('canvas');
            this.canvas.style.display = 'block';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.ctx = this.canvas.getContext('2d');
            container.appendChild(this.canvas);
            this.resize();
        }

        initEvents() {
            if (this.config.autoResize) {
                window.addEventListener('resize', () => this.resize());
            }
            window.addEventListener('mousemove', (e) => {
                if (this.state.trackingMode === 'mouse' && this.config.features.tracking) {
                    const rect = this.canvas.getBoundingClientRect();
                    this.state.targetX = e.clientX - rect.left;
                    this.state.targetY = e.clientY - rect.top;
                }
            });
        }

        resize() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.x = this.width / 2;
            this.y = this.height / 2;

            if (this.state.trackingMode !== 'fixed') {
                this.state.targetX = this.width / 2;
                this.state.targetY = this.height / 2;
            }
        }

        initHair() {
            this.hairs = [];
            for (let i = 0; i < 34; i++) {
                let a = Math.PI * 0.7 + (i / 34) * Math.PI * 1.6;
                this.hairs.push(new HairRibbon(a, 160 + Math.random() * 40, 18, 'back', this.simplex));
            }
            this.hairs.push(new HairRibbon(Math.PI * 0.85, 160, 20, 'side', this.simplex));
            this.hairs.push(new HairRibbon(Math.PI * 2.15, 160, 20, 'side', this.simplex));
            let bangCount = 14;
            for (let i = 0; i < bangCount; i++) {
                let a = Math.PI * 1.1 + (i / bangCount) * 0.8;
                this.hairs.push(new HairRibbon(a, 90 + Math.random() * 20, 16, 'bangs', this.simplex));
            }
            this.hairs.push(new HairRibbon(Math.PI * 1.5, 95, 18, 'bangs', this.simplex));
        }

        // ============================================
        // 4. API METHODS
        // ============================================

        /**
         * Set current mood.
         * @param {string} mood - 'neutral', 'happy', 'excited', 'annoyed', 'love', 'smirk', 'shocked', 'illusion', 'money'
         * @param {number} [duration] - Optional duration ms to hold mood before reverting to base.
         */
        setMood(mood, duration = null) {
            this.state.mood = mood;
            if (this.config.onMoodChange) this.config.onMoodChange(mood);

            if (this.timers.mood) clearTimeout(this.timers.mood);
            if (duration) {
                this.timers.mood = setTimeout(() => {
                    this.state.mood = this.state.baseMood;
                    if (this.config.onMoodChange) this.config.onMoodChange(this.state.baseMood);
                }, duration);
            }
        }

        setBaseMood(mood) {
            this.state.baseMood = mood;
            if (!this.timers.mood) this.state.mood = mood;
        }

        /**
         * Say something in a bubble.
         */
        say(text, duration = null) {
            if (!this.config.features.speechBubbles) return;
            this.state.message = text;
            this.state.messageType = 'say';
            this.state.messageOpacity = 0;
            this.state.isTalking = true;

            if (this.config.onTalkStart) this.config.onTalkStart(text);

            const d = duration || (2000 + (text.split(' ').length * 200));

            if (this.timers.talk) clearTimeout(this.timers.talk);
            this.timers.talk = setTimeout(() => {
                this.state.isTalking = false;
                if (this.config.onTalkEnd) this.config.onTalkEnd();
            }, d);
        }

        stopMessage() {
            this.state.message = null;
            this.state.isTalking = false;
            if (this.timers.talk) clearTimeout(this.timers.talk);
        }

        /**
         * Control Eye Tracking
         */
        lookAt(x, y) {
            if (!this.config.features.tracking) return;
            this.state.trackingMode = 'fixed';
            this.state.targetX = x;
            this.state.targetY = y;
        }

        trackMouse() {
            if (this.config.features.tracking) {
                this.state.trackingMode = 'mouse';
            }
        }

        /**
         * Enable/Disable specific features dynamically
         * @param {string} feature - 'tracking', 'blinking', 'bobbing', 'speechBubbles'
         * @param {boolean} enabled 
         */
        toggle(feature, enabled) {
            if (this.config.features.hasOwnProperty(feature)) {
                this.config.features[feature] = enabled;
            }
        }

        /**
         * Configure Idle Behavior
         * @param {object} config - partial idle config { enabled: bool, actions: [], allowedMoods: [] }
         */
        configureIdle(config) {
            Object.assign(this.config.idle, config);
        }

        // --- GESTURE API ---

        nod(duration = 1000) {
            this.triggerGesture('nod', duration);
        }

        shake(duration = 1000) {
            this.triggerGesture('shake', duration);
        }

        lean(side = 'right', duration = 2000) {
            this.triggerGesture(side === 'right' ? 'leanR' : 'leanL', duration);
        }

        closeEyes(state) {
            this.state.forceEyesClosed = state;
        }

        toggleTalk(state) {
            this.state.isTalking = state;
        }

        triggerGesture(type, duration) {
            this.state.gestureType = type;
            this.state.gestureTime = 0;
            let prevIdle = this.config.idle.enabled;
            this.config.idle.enabled = false;

            if (this.timers.gesture) clearTimeout(this.timers.gesture);
            this.timers.gesture = setTimeout(() => {
                this.state.gestureType = null;
                this.config.idle.enabled = prevIdle;
            }, duration);
        }

        updateTheme(newColors) {
            Object.assign(this.colors, newColors);
        }

        // ============================================
        // 5. ANIMATION LOOP
        // ============================================

        destroy() {
            this.destroyed = true;
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }

        // ============================================
        // 5. ANIMATION LOOP
        // ============================================

        animate() {
            if (this.destroyed) return;
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.time += 0.02;
            this.updatePhysics();
            this.draw();
            requestAnimationFrame(this.animate);
        }

        updatePhysics() {
            // 1. SMART IDLE SYSTEM
            if (this.config.idle.enabled && !this.state.gestureType) {
                let now = Date.now();
                // Random interval
                let interval = lerp(this.config.idle.intervalMin, this.config.idle.intervalMax, Math.random());

                if (now - this.state.lastIdleTime > interval) {
                    let r = Math.random();
                    let actions = this.config.idle.actions;
                    let action = actions[Math.floor(Math.random() * actions.length)];

                    // Reset transient states
                    this.state.noseShiftY = 0;
                    this.state.headTilt = 0;

                    if (action === 'glance') {
                        // Look randomly
                        let px = this.state.targetX, py = this.state.targetY, pm = this.state.trackingMode;
                        this.state.trackingMode = 'fixed';
                        this.state.targetX = this.width / 2 + (Math.random() - 0.5) * 300;
                        this.state.targetY = this.height / 2 + (Math.random() - 0.5) * 200;
                        setTimeout(() => {
                            this.state.trackingMode = pm;
                            if (pm === 'fixed') { this.state.targetX = px; this.state.targetY = py; }
                        }, 1000);
                        if (this.config.onIdleAction) this.config.onIdleAction('glance');

                    } else if (action === 'blink_flurry' && this.config.features.blinking) {
                        this.state.blinkState = 1;
                        setTimeout(() => { this.state.blinkState = 1; }, 150);
                        if (this.config.onIdleAction) this.config.onIdleAction('blink');

                    } else if (action === 'tilt') {
                        this.state.headTilt = (Math.random() - 0.5) * 0.15;
                        setTimeout(() => { this.state.headTilt = 0; }, 1500);
                        if (this.config.onIdleAction) this.config.onIdleAction('tilt');

                    } else if (action === 'mood_shift') {
                        // Brief mood change
                        let prevMood = this.state.mood;
                        let allowed = this.config.idle.allowedMoods;
                        if (allowed.length > 0) {
                            let randomMood = allowed[Math.floor(Math.random() * allowed.length)];
                            this.setMood(randomMood);
                            setTimeout(() => { this.setMood(prevMood); }, 1500);
                            if (this.config.onIdleAction) this.config.onIdleAction('mood: ' + randomMood);
                        }
                    }

                    this.state.lastIdleTime = now;
                }
            }

            // 2. HEAD MOTION (Noise-Driven Organic Float)
            let bobX = 0, bobY = 0;

            if (this.config.features.bobbing) {
                // Organic drift using noise
                // Slow time factor for drift
                let driftTime = this.time * 0.5 * this.config.physics.bobSpeed;
                let noiseX = this.simplex.noise2D(driftTime, 0);
                let noiseY = this.simplex.noise2D(driftTime, 100);

                // Base float
                bobX = noiseX * 3 * this.config.physics.bobAmplitude;
                bobY = noiseY * 5 * this.config.physics.bobAmplitude;

                // Add breathing sine wave on Y
                bobY += Math.sin(this.time * 2 * this.config.physics.bobSpeed) * 2 * this.config.physics.bobAmplitude;
            }

            // 3. GESTURE OVERRIDES
            let targetTilt = 0;
            if (this.state.gestureType === 'nod') {
                this.state.gestureTime += 0.2;
                bobY += Math.sin(this.state.gestureTime) * 8;
            } else if (this.state.gestureType === 'shake') {
                this.state.gestureTime += 0.2;
                this.lookX = this.width / 2;
                targetTilt = Math.sin(this.state.gestureTime) * 0.05;
                bobX += Math.sin(this.state.gestureTime) * 6;
            } else if (this.state.gestureType === 'leanR') {
                targetTilt = 0.15;
            } else if (this.state.gestureType === 'leanL') {
                targetTilt = -0.15;
            }

            // 4. TRACKING PHYSICS
            let tx = this.state.targetX;
            let ty = this.state.targetY;
            if (!this.config.features.tracking) {
                // Return to center if tracking disabled
                tx = this.width / 2;
                ty = this.height / 2;
            }

            let speed = this.config.physics.trackingSpeed;
            this.lookX = lerp(this.lookX, tx, speed);
            this.lookY = lerp(this.lookY, ty, speed);

            // 5. BODY & HEAD POSITIONING
            // Body moves slightly towards look target
            let bodyTargetX = this.width / 2 + (this.lookX - this.width / 2) * 0.04;
            let bodyTargetY = this.height / 2 + (this.lookY - this.height / 2) * 0.04;

            this.x = lerp(this.x, bodyTargetX, 0.1);
            this.y = lerp(this.y, bodyTargetY, 0.1);

            this.bodyX = this.x;
            this.bodyY = this.y;
            this.headX = this.x + bobX;
            this.headY = this.y + bobY;

            this.currentTilt = lerp(this.currentTilt, targetTilt + this.state.headTilt, 0.1);

            // 6. BLINKING
            if (this.config.features.blinking) {
                this.blinkTimer++;
                if (this.blinkTimer > this.config.physics.blinkInterval + Math.random() * 200) {
                    this.state.blinkState = 1;
                    this.blinkTimer = 0;
                }
                if (this.state.blinkState > 0) {
                    this.state.blinkState -= 0.15;
                    if (this.state.blinkState < 0) this.state.blinkState = 0;
                }
            } else {
                this.state.blinkState = 0;
            }

            // Hair
            this.hairs.forEach(h => h.update(this.headX, this.headY, this.lookX, this.currentTilt, this.time, this.width));
        }

        // ============================================
        // 6. DRAWING
        // ============================================

        draw() {
            const ctx = this.ctx;
            ctx.save();
            ctx.translate(this.headX, this.headY);
            ctx.scale(this.config.scale, this.config.scale);
            if (Math.abs(this.currentTilt) > 0.001) ctx.rotate(this.currentTilt);
            ctx.translate(-this.headX, -this.headY);

            this.hairs.filter(h => h.type === 'back').forEach(h => h.draw(ctx, this.colors));
            this.drawBody(ctx);
            this.drawFaceBase(ctx);
            this.drawFeatures(ctx);
            this.hairs.filter(h => h.type !== 'back').forEach(h => h.draw(ctx, this.colors));
            this.drawAccessories(ctx);

            ctx.restore();

            if (this.state.message && this.config.features.speechBubbles) {
                this.drawBubble(ctx, this.state.message);
            }
        }

        drawBubble(ctx, text) {
            const fontSize = 15;
            const lineHeight = 22;
            const padding = 20;
            const font = "700 15px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

            ctx.font = font;
            const lines = getLines(ctx, text, 200);

            let maxLineWidth = 0;
            lines.forEach(l => maxLineWidth = Math.max(maxLineWidth, ctx.measureText(l).width));
            const bubbleWidth = Math.max(80, maxLineWidth + padding * 2);
            const bubbleHeight = (lines.length * lineHeight) + padding * 2;

            const bx = this.headX + 60;
            const by = this.headY - 170 - (bubbleHeight / 2);

            if (this.state.messageOpacity < 1) this.state.messageOpacity += 0.08;
            ctx.save();
            ctx.globalAlpha = this.state.messageOpacity;

            // Shadow
            ctx.shadowColor = "rgba(0,0,0,0.15)";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = 8;

            ctx.fillStyle = this.colors.bubbleBg;
            // No Border
            drawRoundedRect(ctx, bx, by, bubbleWidth, bubbleHeight, 30);
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(bx + 20, by + bubbleHeight);
            ctx.lineTo(bx + 10, by + bubbleHeight + 15);
            ctx.lineTo(bx + 35, by + bubbleHeight);
            ctx.fill();

            ctx.fillStyle = this.colors.bubbleText;
            ctx.shadowColor = "transparent";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const centerX = bx + bubbleWidth / 2;
            let currentY = (by + bubbleHeight / 2) - ((lines.length * lineHeight) / 2) + (lineHeight / 2);

            lines.forEach(line => {
                ctx.fillText(line, centerX, currentY);
                currentY += lineHeight;
            });

            ctx.restore();
        }

        drawBody(ctx) {
            let neckW = 42;
            let shoulderYOffset = 118;
            const C = this.colors;

            // Neck
            ctx.fillStyle = C.skinShadow;
            ctx.beginPath();
            ctx.moveTo(this.headX - neckW / 2, this.headY + 65);
            ctx.lineTo(this.headX + neckW / 2, this.headY + 65);
            ctx.lineTo(this.bodyX + neckW / 2, this.bodyY + shoulderYOffset);
            ctx.lineTo(this.bodyX - neckW / 2, this.bodyY + shoulderYOffset);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.headX - neckW / 2, this.headY + 65); ctx.lineTo(this.bodyX - neckW / 2, this.bodyY + shoulderYOffset);
            ctx.moveTo(this.headX + neckW / 2, this.headY + 65); ctx.lineTo(this.bodyX + neckW / 2, this.bodyY + shoulderYOffset);
            ctx.lineWidth = 1.2; ctx.strokeStyle = C.line; ctx.stroke();

            // Shoulders
            ctx.fillStyle = C.skinBase;
            ctx.beginPath(); ctx.moveTo(this.bodyX - neckW / 2, this.bodyY + shoulderYOffset - 5);
            ctx.quadraticCurveTo(this.bodyX - 60, this.bodyY + shoulderYOffset, this.bodyX - 100, this.bodyY + shoulderYOffset + 40);
            ctx.lineTo(this.bodyX + 100, this.bodyY + shoulderYOffset + 40);
            ctx.quadraticCurveTo(this.bodyX + 60, this.bodyY + shoulderYOffset, this.bodyX + neckW / 2, this.bodyY + shoulderYOffset - 5);
            ctx.fill();

            // Clothing
            let clothY = this.bodyY + shoulderYOffset + 5;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.bodyX - 40, clothY);
            ctx.quadraticCurveTo(this.bodyX - 70, clothY + 5, this.bodyX - 110, clothY + 50);
            ctx.lineTo(this.bodyX + 110, clothY + 50);
            ctx.quadraticCurveTo(this.bodyX + 70, clothY + 5, this.bodyX + 40, clothY);
            ctx.quadraticCurveTo(this.bodyX, clothY + 20, this.bodyX - 40, clothY);
            ctx.closePath();
            ctx.fillStyle = C.clothesDark; ctx.fill();

            ctx.clip();
            ctx.lineWidth = 4;
            let pColors = [C.pattern1, C.pattern2, C.pattern3, '#FFF'];
            let step = 10, amp = 8, idx = 0;
            for (let py = clothY; py < clothY + 100; py += 12) {
                ctx.strokeStyle = pColors[idx % pColors.length];
                idx++;
                ctx.beginPath(); ctx.moveTo(this.bodyX - 120, py);
                for (let px = this.bodyX - 120; px < this.bodyX + 120; px += step * 2) {
                    ctx.lineTo(px + step, py + amp); ctx.lineTo(px + step * 2, py);
                }
                ctx.stroke();
            }
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(this.bodyX - 40, clothY);
            ctx.quadraticCurveTo(this.bodyX - 70, clothY + 5, this.bodyX - 110, clothY + 50);
            ctx.lineTo(this.bodyX + 110, clothY + 50);
            ctx.quadraticCurveTo(this.bodyX + 70, clothY + 5, this.bodyX + 40, clothY);
            ctx.quadraticCurveTo(this.bodyX, clothY + 20, this.bodyX - 40, clothY);
            ctx.lineWidth = 1.5; ctx.strokeStyle = C.line; ctx.stroke();

            ctx.fillStyle = C.clothesLight;
            ctx.beginPath();
            ctx.moveTo(this.bodyX - 40, clothY); ctx.lineTo(this.bodyX - 25, clothY);
            ctx.lineTo(this.bodyX, clothY + 25); ctx.lineTo(this.bodyX + 25, clothY);
            ctx.lineTo(this.bodyX + 40, clothY);
            ctx.quadraticCurveTo(this.bodyX, clothY + 20, this.bodyX - 40, clothY);
            ctx.fill(); ctx.lineWidth = 1; ctx.stroke();

            ctx.fillStyle = C.clothesAccent;
            ctx.beginPath();
            ctx.moveTo(this.bodyX, clothY + 25);
            ctx.quadraticCurveTo(this.bodyX - 15, clothY + 20, this.bodyX - 15, clothY + 30);
            ctx.lineTo(this.bodyX, clothY + 35); ctx.lineTo(this.bodyX + 15, clothY + 30);
            ctx.quadraticCurveTo(this.bodyX + 15, clothY + 20, this.bodyX, clothY + 25);
            ctx.fill();
            ctx.fillStyle = C.redAccent;
            ctx.beginPath(); ctx.arc(this.bodyX, clothY + 30, 4, 0, Math.PI * 2); ctx.fill();

            let chokerY = this.headY + 98;
            ctx.fillStyle = C.choker;
            ctx.beginPath();
            ctx.moveTo(this.headX - neckW / 2 - 1, chokerY);
            ctx.quadraticCurveTo(this.headX, chokerY + 4, this.headX + neckW / 2 + 1, chokerY);
            ctx.lineTo(this.headX + neckW / 2 + 1, chokerY + 8);
            ctx.quadraticCurveTo(this.headX, chokerY + 12, this.headX - neckW / 2 - 1, chokerY + 8);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = C.gold;
            ctx.beginPath(); ctx.arc(this.headX, chokerY + 6, 3, 0, Math.PI * 2); ctx.fill();

            let badgeX = this.bodyX + 35, badgeY = clothY + 45;
            ctx.fillStyle = C.badgeBg;
            drawRoundedRect(ctx, badgeX - 25, badgeY - 10, 50, 20, 4); ctx.fill();
            ctx.fillStyle = C.badgeText;
            ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(this.config.badgeText, badgeX, badgeY);
        }

        drawFaceBase(ctx) {
            const C = this.colors;
            ctx.fillStyle = C.skinBase;
            ctx.beginPath(); ctx.arc(this.headX, this.headY, 78, Math.PI, 0);
            ctx.bezierCurveTo(this.headX + 78, this.headY + 50, this.headX + 30, this.headY + 115, this.headX, this.headY + 115);
            ctx.bezierCurveTo(this.headX - 30, this.headY + 115, this.headX - 78, this.headY + 50, this.headX - 78, this.headY);
            ctx.fill();
            ctx.lineWidth = 1.5; ctx.strokeStyle = C.line; ctx.stroke();

            if (this.state.mood === 'shocked') {
                ctx.fillStyle = '#A29BFE'; ctx.globalAlpha = 0.5;
                for (let i = 0; i < 5; i++) {
                    let lx = this.headX - 40 + i * 20, ly = this.headY - 10;
                    ctx.beginPath(); ctx.rect(lx, ly, 2, 20 + Math.random() * 10); ctx.fill();
                }
                ctx.globalAlpha = 1.0;
            } else if (this.state.mood !== 'annoyed') {
                let blushAlpha = 0.6;
                if (this.state.mood === 'love' || this.state.mood === 'happy') blushAlpha = 0.9;
                let grad = ctx.createRadialGradient(this.headX - 50, this.headY + 55, 0, this.headX - 50, this.headY + 55, 20);
                grad.addColorStop(0, C.blush); grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad; ctx.globalAlpha = blushAlpha; ctx.fillRect(this.headX - 80, this.headY + 35, 60, 60);
                let gradR = ctx.createRadialGradient(this.headX + 50, this.headY + 55, 0, this.headX + 50, this.headY + 55, 20);
                gradR.addColorStop(0, C.blush); gradR.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gradR; ctx.fillRect(this.headX + 20, this.headY + 35, 60, 60);
                ctx.globalAlpha = 1.0;
            }
        }

        drawFeatures(ctx) {
            let rawDx = (this.lookX - this.width / 2) * 0.05;
            let rawDy = (this.lookY - this.height / 2) * 0.05;
            let maxDist = 22;
            let dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
            if (dist > maxDist) {
                let ratio = maxDist / dist;
                rawDx *= ratio;
                rawDy *= ratio;
            }
            let lookX = rawDx;
            let lookY = rawDy;

            let blink = this.state.blinkState;
            let eyesClosed = this.state.forceEyesClosed || blink > 0.8;

            this.drawEye(ctx, this.headX - 38, this.headY + 32, lookX, lookY, eyesClosed, 'left');
            this.drawEye(ctx, this.headX + 38, this.headY + 32, lookX, lookY, eyesClosed, 'right');

            let nx = this.headX + this.state.noseShiftX;
            let ny = this.headY + 72 + this.state.noseShiftY;
            ctx.fillStyle = '#D6A292';
            ctx.beginPath(); ctx.moveTo(nx - 1, ny); ctx.lineTo(nx + 1, ny + 2); ctx.lineTo(nx - 2, ny + 3); ctx.fill();

            ctx.strokeStyle = '#E08283'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
            let mouthY = this.headY + 92;
            let scale = this.state.mouthScale;

            if (this.state.isTalking) {
                let openAmt = (Math.sin(this.time * 15) + 1) * (2 * scale);
                ctx.fillStyle = '#633'; ctx.beginPath();
                ctx.ellipse(this.headX, mouthY, 5 * scale, (2 + openAmt), 0, 0, Math.PI * 2); ctx.fill();
                if (openAmt > 2) {
                    ctx.fillStyle = '#E08283'; ctx.beginPath();
                    ctx.arc(this.headX, mouthY + openAmt, 3 * scale, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                let mood = this.state.mood;
                if (eyesClosed && mood !== 'annoyed') {
                    ctx.moveTo(this.headX - 6, mouthY);
                    ctx.quadraticCurveTo(this.headX - 3, mouthY + 3, this.headX, mouthY);
                    ctx.quadraticCurveTo(this.headX + 3, mouthY + 3, this.headX + 6, mouthY); ctx.stroke();
                } else {
                    if (mood === 'happy') {
                        ctx.moveTo(this.headX - (9 * scale), mouthY);
                        ctx.quadraticCurveTo(this.headX, mouthY + (6 * scale), this.headX + (9 * scale), mouthY); ctx.stroke();
                    } else if (mood === 'neutral' || mood === 'love') {
                        ctx.moveTo(this.headX - (6 * scale), mouthY);
                        ctx.quadraticCurveTo(this.headX, mouthY + (2 * scale), this.headX + (6 * scale), mouthY); ctx.stroke();
                    } else if (mood === 'annoyed') {
                        ctx.moveTo(this.headX - (6 * scale), mouthY + 2);
                        ctx.quadraticCurveTo(this.headX, mouthY - (1 * scale), this.headX + (6 * scale), mouthY + 2); ctx.stroke();
                    } else if (mood === 'smirk') {
                        ctx.moveTo(this.headX - 6, mouthY + 1);
                        ctx.quadraticCurveTo(this.headX + 2, mouthY + 3, this.headX + 8, mouthY - 2); ctx.stroke();
                    } else if (mood === 'excited') {
                        ctx.save(); ctx.beginPath(); ctx.moveTo(this.headX - 12, mouthY);
                        ctx.quadraticCurveTo(this.headX, mouthY + 20, this.headX + 12, mouthY);
                        ctx.lineTo(this.headX - 12, mouthY); ctx.fillStyle = '#633030'; ctx.fill(); ctx.clip();
                        ctx.fillStyle = '#FF7675'; ctx.beginPath(); ctx.arc(this.headX, mouthY + 25, 12, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = '#FFF'; ctx.fillRect(this.headX - 10, mouthY, 20, 4); ctx.restore();
                    } else if (mood === 'shocked') {
                        ctx.fillStyle = '#633'; ctx.beginPath(); ctx.ellipse(this.headX, mouthY + 4, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
                    } else if (mood === 'illusion' || mood === 'money') {
                        ctx.moveTo(this.headX - 7, mouthY); ctx.quadraticCurveTo(this.headX, mouthY + 4, this.headX + 7, mouthY); ctx.stroke();
                    }
                }
            }
        }

        drawAccessories(ctx) {
            const C = this.colors;
            ctx.strokeStyle = C.gold; ctx.lineWidth = 2;

            let cx = this.headX - 55, cy = this.headY - 10;
            ctx.beginPath(); ctx.moveTo(cx - 4, cy - 4); ctx.lineTo(cx + 4, cy + 4); ctx.moveTo(cx + 4, cy - 4); ctx.lineTo(cx - 4, cy + 4); ctx.stroke();
            cx = this.headX + 55;
            ctx.beginPath(); ctx.moveTo(cx - 4, cy - 4); ctx.lineTo(cx + 4, cy + 4); ctx.moveTo(cx + 4, cy - 4); ctx.lineTo(cx - 4, cy + 4); ctx.stroke();

            this.drawEarring(ctx, this.headX - 72, this.headY + 55);
            this.drawEarring(ctx, this.headX + 72, this.headY + 55);
            this.drawBow(ctx, this.headX + 65, this.headY - 45);
        }

        drawEarring(ctx, x, y) {
            const C = this.colors;
            ctx.save(); ctx.translate(x, y);
            ctx.rotate(Math.sin(this.time * 2) * 0.05);
            ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 10); ctx.stroke();
            ctx.fillStyle = C.redAccent; ctx.beginPath();
            ctx.moveTo(0, 10); ctx.lineTo(7, 20); ctx.lineTo(0, 32); ctx.lineTo(-7, 20); ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'white'; ctx.globalAlpha = 0.4;
            ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(3, 18); ctx.lineTo(0, 24); ctx.lineTo(-3, 18); ctx.fill();
            ctx.globalAlpha = 1.0; ctx.restore();
        }

        drawBow(ctx, x, y) {
            const C = this.colors;
            ctx.save(); ctx.translate(x, y); ctx.rotate(0.2); ctx.scale(1.8, 1.8);
            ctx.fillStyle = C.clothesAccent; ctx.strokeStyle = C.line; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-15, -25, -45, -15, -30, 0); ctx.bezierCurveTo(-45, 15, -15, 25, 0, 0);
            ctx.moveTo(-5, 0); ctx.lineTo(-20, 0); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.bezierCurveTo(15, -25, 45, -15, 30, 0); ctx.bezierCurveTo(45, 15, 15, 25, 0, 0);
            ctx.moveTo(5, 0); ctx.lineTo(20, 0); ctx.fill(); ctx.stroke();
            ctx.fillStyle = C.redAccent; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        }

        drawEye(ctx, x, y, lx, ly, isClosed, side) {
            const C = this.colors;
            let w = 27, h = 33;
            let browYOffset = 0, browRot = 0;
            let mood = this.state.mood;

            if (mood === 'happy') browYOffset = -5;
            if (mood === 'excited') browYOffset = -7;
            if (mood === 'annoyed') { browYOffset = 4; browRot = (side === 'left') ? 0.35 : -0.35; }
            if (mood === 'shocked') { browYOffset = -10; browRot = (side === 'left') ? -0.2 : 0.2; }
            if (mood === 'smirk') {
                if (side === 'right') { browYOffset = -3; } else { browYOffset = 3; browRot = 0.2; }
            }
            if (mood === 'illusion' || mood === 'money') browYOffset = -2;

            if (isClosed) {
                ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.lineCap = 'round';
                let cx = (side === 'left') ? x + 2 : x - 2;
                ctx.beginPath(); ctx.moveTo(cx - 15, y);
                ctx.quadraticCurveTo(cx, y + 7, cx + 15, y); ctx.stroke();
                ctx.lineWidth = 2.5; ctx.beginPath();
                if (side === 'left') {
                    let lx = cx - 15, ly = y; ctx.moveTo(lx, ly); ctx.lineTo(lx - 6, ly - 3); ctx.moveTo(lx + 2, ly + 2); ctx.lineTo(lx - 4, ly + 5);
                } else {
                    let rx = cx + 15, ry = y; ctx.moveTo(rx, ry); ctx.lineTo(rx + 6, ry - 3); ctx.moveTo(rx - 2, ry + 2); ctx.lineTo(rx + 4, ry + 5);
                }
                ctx.stroke();
            } else {
                ctx.fillStyle = C.eyeWhite; ctx.beginPath();
                let lidH = h; if (mood === 'smirk') lidH = h * 0.8;
                ctx.ellipse(x, y, w, lidH, 0, 0, Math.PI * 2); ctx.fill();

                ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, w, lidH, 0, 0, Math.PI * 2); ctx.clip();

                if (mood === 'love') {
                    ctx.translate(x + lx, y + ly);
                    ctx.fillStyle = '#E84118'; ctx.beginPath(); ctx.moveTo(0, 5);
                    ctx.bezierCurveTo(0, 0, -5, -5, -10, -5); ctx.bezierCurveTo(-20, -5, -20, 10, 0, 20);
                    ctx.bezierCurveTo(20, 10, 20, -5, 10, -5); ctx.bezierCurveTo(5, -5, 0, 0, 0, 5); ctx.fill();
                    let hGrad = ctx.createLinearGradient(0, -10, 0, 20); hGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); hGrad.addColorStop(1, 'rgba(0, 0, 0, 0.1)'); ctx.fillStyle = hGrad; ctx.fill();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.beginPath(); ctx.ellipse(-5, -2, 3, 2, -0.5, 0, Math.PI * 2); ctx.fill();
                } else if (mood === 'illusion') {
                    ctx.translate(x, y); ctx.rotate(this.time * 5); ctx.strokeStyle = '#2C3E50'; ctx.lineWidth = 2; ctx.beginPath();
                    for (let i = 0; i < 40; i++) {
                        let angle = 0.4 * i, r = 1 + 0.6 * i;
                        let px = Math.cos(angle) * r, py = Math.sin(angle) * r;
                        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                } else if (mood === 'money') {
                    ctx.translate(x, y);
                    ctx.fillStyle = '#27ae60'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#FFD700'; ctx.font = "bold 40px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("$", 0, 4);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(-10, -10, 6, 4, -0.6, 0, Math.PI * 2); ctx.fill();
                } else {
                    let irisScale = (mood === 'shocked') ? 0.4 : 1.0;
                    let ix = x + lx, iy = y + ly, iSize = 18 * irisScale;
                    let grad = ctx.createLinearGradient(ix, iy - iSize, ix, iy + iSize);
                    grad.addColorStop(0, C.eyeIrisDark); grad.addColorStop(0.5, '#9B59B6'); grad.addColorStop(1, C.eyeIrisLight);
                    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(ix, iy, iSize, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = C.eyePupil; ctx.beginPath(); ctx.arc(ix, iy, 7 * irisScale, 0, Math.PI * 2); ctx.fill();
                    if (mood !== 'shocked') {
                        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(ix - 7, iy - 6, 6, 4, -0.6, 0, Math.PI * 2); ctx.fill();
                        ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(ix + 6, iy + 6, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0;
                    }
                }
                ctx.restore();

                ctx.strokeStyle = C.line; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
                let lashY = y - lidH; ctx.beginPath(); ctx.moveTo(x - w + 2, lashY + 8); ctx.quadraticCurveTo(x, lashY - 5, x + w - 2, lashY + 8); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x + w - 4, lashY + 6); ctx.lineTo(x + w + 8, lashY - 3); ctx.stroke();
            }

            ctx.save(); ctx.translate(x, y - 40); ctx.rotate(browRot); ctx.lineWidth = 1.5; ctx.strokeStyle = '#8A8199';
            ctx.beginPath();
            let browCurve = 4;
            if (mood === 'annoyed') browCurve = -2;
            if (mood === 'shocked') browCurve = 6;
            if (mood === 'smirk' && side === 'right') browCurve = 2;
            if (mood === 'illusion' || mood === 'money') browCurve = 5;
            ctx.moveTo(-12, browYOffset); ctx.quadraticCurveTo(0, browYOffset - browCurve, 12, browYOffset); ctx.stroke();
            ctx.restore();
        }
    }

    global.CyoniMascot = CyoniMascot;

})(window);
