'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { createNoise3D } from 'simplex-noise';
import { motion } from 'framer-motion';

interface VortexProps {
    children?: ReactNode;
    className?: string;
    containerClassName?: string;
    particleCount?: number;
    rangeY?: number;
    baseHue?: number;
    baseSpeed?: number;
    rangeSpeed?: number;
    baseRadius?: number;
    rangeRadius?: number;
    backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const config = useMemo(
        () => ({
            particleCount: props.particleCount ?? 700,
            rangeY: props.rangeY ?? 100,
            baseSpeed: props.baseSpeed ?? 0,
            rangeSpeed: props.rangeSpeed ?? 1.5,
            baseRadius: props.baseRadius ?? 1,
            rangeRadius: props.rangeRadius ?? 2,
            baseHue: props.baseHue ?? 220,
            backgroundColor: props.backgroundColor ?? '#000000',
        }),
        [
            props.particleCount,
            props.rangeY,
            props.baseSpeed,
            props.rangeSpeed,
            props.baseRadius,
            props.rangeRadius,
            props.baseHue,
            props.backgroundColor,
        ]
    );
    const particleCount = config.particleCount;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const baseTTL = 50;
    const rangeTTL = 150;
    const rangeHue = 100;
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const tickRef = useRef(0);
    const noise3D = useMemo(() => createNoise3D(), []);
    const particlePropsRef = useRef(new Float32Array(particlePropsLength));
    const centerRef = useRef<[number, number]>([0, 0]);

    const TAU = useMemo(() => 2 * Math.PI, []);
    const rand = useCallback((n: number): number => n * Math.random(), []);
    const randRange = useCallback(
        (n: number): number => n - rand(2 * n),
        [rand]
    );
    const fadeInOut = useCallback((t: number, m: number): number => {
        const hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    }, []);
    const lerp = useCallback(
        (n1: number, n2: number, speed: number): number =>
            (1 - speed) * n1 + speed * n2,
        []
    );

    const resize = useCallback((canvas: HTMLCanvasElement) => {
        const { innerWidth, innerHeight } = window;

        canvas.width = innerWidth;
        canvas.height = innerHeight;

        centerRef.current[0] = 0.5 * canvas.width;
        centerRef.current[1] = 0.5 * canvas.height;
    }, []);

    const initParticle = useCallback(
        (i: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const x = rand(canvas.width);
            const y = centerRef.current[1] + randRange(config.rangeY);
            const vx = 0;
            const vy = 0;
            const life = 0;
            const ttl = baseTTL + rand(rangeTTL);
            const speed = config.baseSpeed + rand(config.rangeSpeed);
            const radius = config.baseRadius + rand(config.rangeRadius);
            const hue = config.baseHue + rand(rangeHue);

            particlePropsRef.current.set(
                [x, y, vx, vy, life, ttl, speed, radius, hue],
                i
            );
        },
        [config, rand, randRange]
    );

    const initParticles = useCallback(() => {
        tickRef.current = 0;
        particlePropsRef.current = new Float32Array(particlePropsLength);

        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
        }
    }, [initParticle, particlePropsLength]);

    const drawParticle = useCallback(
        (
            x: number,
            y: number,
            x2: number,
            y2: number,
            life: number,
            ttl: number,
            radius: number,
            hue: number,
            ctx: CanvasRenderingContext2D
        ) => {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineWidth = radius;
            ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        },
        [fadeInOut]
    );

    const checkBounds = useCallback(
        (x: number, y: number, canvas: HTMLCanvasElement) => {
            return x > canvas.width || x < 0 || y > canvas.height || y < 0;
        },
        []
    );

    const updateParticle = useCallback(
        (i: number, ctx: CanvasRenderingContext2D) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const i2 = 1 + i;
            const i3 = 2 + i;
            const i4 = 3 + i;
            const i5 = 4 + i;
            const i6 = 5 + i;
            const i7 = 6 + i;
            const i8 = 7 + i;
            const i9 = 8 + i;
            const x = particlePropsRef.current[i];
            const y = particlePropsRef.current[i2];
            const n =
                noise3D(x * xOff, y * yOff, tickRef.current * zOff) *
                noiseSteps *
                TAU;
            const vx = lerp(particlePropsRef.current[i3], Math.cos(n), 0.5);
            const vy = lerp(particlePropsRef.current[i4], Math.sin(n), 0.5);
            const life = particlePropsRef.current[i5];
            const ttl = particlePropsRef.current[i6];
            const speed = particlePropsRef.current[i7];
            const x2 = x + vx * speed;
            const y2 = y + vy * speed;
            const radius = particlePropsRef.current[i8];
            const hue = particlePropsRef.current[i9];

            drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

            const nextLife = life + 1;

            particlePropsRef.current[i] = x2;
            particlePropsRef.current[i2] = y2;
            particlePropsRef.current[i3] = vx;
            particlePropsRef.current[i4] = vy;
            particlePropsRef.current[i5] = nextLife;

            if (checkBounds(x, y, canvas) || nextLife > ttl) {
                initParticle(i);
            }
        },
        [TAU, checkBounds, drawParticle, initParticle, lerp, noise3D]
    );

    const drawParticles = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            for (let i = 0; i < particlePropsLength; i += particlePropCount) {
                updateParticle(i, ctx);
            }
        },
        [particlePropsLength, updateParticle]
    );

    const renderGlow = useCallback(
        (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.save();
            ctx.filter = 'blur(8px) brightness(200%)';
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();

            ctx.save();
            ctx.filter = 'blur(4px) brightness(200%)';
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();
        },
        []
    );

    const renderToScreen = useCallback(
        (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(canvas, 0, 0);
            ctx.restore();
        },
        []
    );

    const drawRef = useRef<
        | ((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void)
        | null
    >(null);
    const draw = useCallback(
        (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            tickRef.current += 1;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawParticles(ctx);
            renderGlow(canvas, ctx);
            renderToScreen(canvas, ctx);

            window.requestAnimationFrame(() => drawRef.current?.(canvas, ctx));
        },
        [config.backgroundColor, drawParticles, renderGlow, renderToScreen]
    );

    const setup = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                resize(canvas);
                initParticles();
                draw(canvas, ctx);
            }
        }
    }, [draw, initParticles, resize]);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            resize(canvas);
        }
    }, [resize]);

    useEffect(() => {
        drawRef.current = draw;
        setup();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [draw, handleResize, setup]);

    return (
        <div className={cn('relative h-full w-full', props.containerClassName)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={containerRef}
                className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
            >
                <canvas ref={canvasRef}></canvas>
            </motion.div>

            <div className={cn('relative z-10', props.className)}>
                {props.children}
            </div>
        </div>
    );
};
