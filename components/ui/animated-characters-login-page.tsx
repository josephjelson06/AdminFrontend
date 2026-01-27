"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useAuth } from "@/lib/shared/auth";


interface PupilProps {
    size?: number;
    maxDistance?: number;
    pupilColor?: string;
    forceLookX?: number;
    forceLookY?: number;
}

const Pupil = ({
    size = 12,
    maxDistance = 5,
    pupilColor = "black",
    forceLookX,
    forceLookY
}: PupilProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const pupilRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const calculatePupilPosition = () => {
        if (!pupilRef.current) return { x: 0, y: 0 };

        // If forced look direction is provided, use that instead of mouse tracking
        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY };
        }

        const pupil = pupilRef.current.getBoundingClientRect();
        const pupilCenterX = pupil.left + pupil.width / 2;
        const pupilCenterY = pupil.top + pupil.height / 2;

        const deltaX = mouseX - pupilCenterX;
        const deltaY = mouseY - pupilCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return { x, y };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={pupilRef}
            className="rounded-full"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: pupilColor,
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        />
    );
};




interface EyeBallProps {
    size?: number;
    pupilSize?: number;
    maxDistance?: number;
    eyeColor?: string;
    pupilColor?: string;
    isBlinking?: boolean;
    forceLookX?: number;
    forceLookY?: number;
}

const EyeBall = ({
    size = 48,
    pupilSize = 16,
    maxDistance = 10,
    eyeColor = "white",
    pupilColor = "black",
    isBlinking = false,
    forceLookX,
    forceLookY
}: EyeBallProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const eyeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const calculatePupilPosition = () => {
        if (!eyeRef.current) return { x: 0, y: 0 };

        // If forced look direction is provided, use that instead of mouse tracking
        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY };
        }

        const eye = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eye.left + eye.width / 2;
        const eyeCenterY = eye.top + eye.height / 2;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return { x, y };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={eyeRef}
            className="rounded-full flex items-center justify-center transition-all duration-150"
            style={{
                width: `${size}px`,
                height: isBlinking ? '2px' : `${size}px`,
                backgroundColor: eyeColor,
                overflow: 'hidden',
            }}
        >
            {!isBlinking && (
                <div
                    className="rounded-full"
                    style={{
                        width: `${pupilSize}px`,
                        height: `${pupilSize}px`,
                        backgroundColor: pupilColor,
                        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                />
            )}
        </div>
    );
};





export function AnimatedCharactersLoginPage() {
    const router = useRouter();
    const { login, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
    const [isBlackBlinking, setIsBlackBlinking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
    const [isPurplePeeking, setIsPurplePeeking] = useState(false);
    const purpleRef = useRef<HTMLDivElement>(null);
    const blackRef = useRef<HTMLDivElement>(null);
    const yellowRef = useRef<HTMLDivElement>(null);
    const orangeRef = useRef<HTMLDivElement>(null);

    // For 3D card effect
    const cardMouseX = useMotionValue(0);
    const cardMouseY = useMotionValue(0);
    const rotateX = useTransform(cardMouseY, [-300, 300], [8, -8]);
    const rotateY = useTransform(cardMouseX, [-300, 300], [-8, 8]);

    const handleCardMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        cardMouseX.set(e.clientX - rect.left - rect.width / 2);
        cardMouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleCardMouseLeave = () => {
        cardMouseX.set(0);
        cardMouseY.set(0);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Blinking effect for purple character
    useEffect(() => {
        const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

        const scheduleBlink = () => {
            const blinkTimeout = setTimeout(() => {
                setIsPurpleBlinking(true);
                setTimeout(() => {
                    setIsPurpleBlinking(false);
                    scheduleBlink();
                }, 150); // Blink duration 150ms
            }, getRandomBlinkInterval());

            return blinkTimeout;
        };

        const timeout = scheduleBlink();
        return () => clearTimeout(timeout);
    }, []);

    // Blinking effect for black character
    useEffect(() => {
        const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

        const scheduleBlink = () => {
            const blinkTimeout = setTimeout(() => {
                setIsBlackBlinking(true);
                setTimeout(() => {
                    setIsBlackBlinking(false);
                    scheduleBlink();
                }, 150); // Blink duration 150ms
            }, getRandomBlinkInterval());

            return blinkTimeout;
        };

        const timeout = scheduleBlink();
        return () => clearTimeout(timeout);
    }, []);

    // Looking at each other animation when typing starts
    useEffect(() => {
        if (isTyping) {
            setIsLookingAtEachOther(true);
            const timer = setTimeout(() => {
                setIsLookingAtEachOther(false);
            }, 800); // Look at each other for 1.5 seconds, then back to tracking mouse
            return () => clearTimeout(timer);
        } else {
            setIsLookingAtEachOther(false);
        }
    }, [isTyping]);

    // Purple sneaky peeking animation when typing password and it's visible
    useEffect(() => {
        if (password.length > 0 && showPassword) {
            const schedulePeek = () => {
                const peekInterval = setTimeout(() => {
                    setIsPurplePeeking(true);
                    setTimeout(() => {
                        setIsPurplePeeking(false);
                    }, 800); // Peek for 800ms
                }, Math.random() * 3000 + 2000); // Random peek every 2-5 seconds
                return peekInterval;
            };

            const firstPeek = schedulePeek();
            return () => clearTimeout(firstPeek);
        } else {
            setIsPurplePeeking(false);
        }
    }, [password, showPassword, isPurplePeeking]);

    const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodyRotation: 0 };

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3; // Focus on head area

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // Face movement (limited range)
        const faceX = Math.max(-15, Math.min(15, deltaX / 20));
        const faceY = Math.max(-10, Math.min(10, deltaY / 30));

        // Body lean (skew for lean while keeping bottom straight) - negative to lean towards mouse
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

        return { faceX, faceY, bodySkew };
    };

    const purplePos = calculatePosition(purpleRef);
    const blackPos = calculatePosition(blackRef);
    const yellowPos = calculatePosition(yellowRef);
    const orangePos = calculatePosition(orangeRef);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                console.log("✅ Login successful!");
                // Redirect based on user panel type
                // Check email domain to determine panel type
                const emailLower = email.toLowerCase();
                if (emailLower.includes('@hotel.in')) {
                    router.push('/hotel');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError("Invalid email or password. Please try again.");
                console.log("❌ Login failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.log("❌ Login failed", err);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden grid lg:grid-cols-2">
            {/* Background gradient effect - purple theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Top radial glow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
            <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
                animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1
                }}
            />

            {/* Animated glow spots */}
            <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
            <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

            {/* Left Content Section - Animated Characters */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 text-white z-10">
                <div className="relative z-20">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <div className="size-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles className="size-4 text-white" />
                        </div>
                        <span>YourBrand</span>
                    </div>
                </div>

                <div className="relative z-20 flex items-end justify-center h-[500px]">
                    {/* Cartoon Characters */}
                    <div className="relative" style={{ width: '550px', height: '400px' }}>
                        {/* Purple tall rectangle character - Back layer */}
                        <div
                            ref={purpleRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '70px',
                                width: '180px',
                                height: (isTyping || (password.length > 0 && !showPassword)) ? '440px' : '400px',
                                backgroundColor: '#6C3FF5',
                                borderRadius: '10px 10px 0 0',
                                zIndex: 1,
                                transform: (password.length > 0 && showPassword)
                                    ? `skewX(0deg)`
                                    : (isTyping || (password.length > 0 && !showPassword))
                                        ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                                        : `skewX(${purplePos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            {/* Eyes */}
                            <div
                                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                                style={{
                                    left: (password.length > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                                    top: (password.length > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                                }}
                            >
                                <EyeBall
                                    size={18}
                                    pupilSize={7}
                                    maxDistance={5}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isPurpleBlinking}
                                    forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                    forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                                />
                                <EyeBall
                                    size={18}
                                    pupilSize={7}
                                    maxDistance={5}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isPurpleBlinking}
                                    forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                    forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                                />
                            </div>
                        </div>

                        {/* Black tall rectangle character - Middle layer */}
                        <div
                            ref={blackRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '240px',
                                width: '120px',
                                height: '310px',
                                backgroundColor: '#2D2D2D',
                                borderRadius: '8px 8px 0 0',
                                zIndex: 2,
                                transform: (password.length > 0 && showPassword)
                                    ? `skewX(0deg)`
                                    : isLookingAtEachOther
                                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                                        : (isTyping || (password.length > 0 && !showPassword))
                                            ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                                            : `skewX(${blackPos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            {/* Eyes */}
                            <div
                                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                                style={{
                                    left: (password.length > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                                    top: (password.length > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                                }}
                            >
                                <EyeBall
                                    size={16}
                                    pupilSize={6}
                                    maxDistance={4}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isBlackBlinking}
                                    forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                    forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                                />
                                <EyeBall
                                    size={16}
                                    pupilSize={6}
                                    maxDistance={4}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isBlackBlinking}
                                    forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                    forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                                />
                            </div>
                        </div>

                        {/* Orange semi-circle character - Front left */}
                        <div
                            ref={orangeRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '0px',
                                width: '240px',
                                height: '200px',
                                zIndex: 3,
                                backgroundColor: '#FF9B6B',
                                borderRadius: '120px 120px 0 0',
                                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            {/* Eyes - just pupils, no white */}
                            <div
                                className="absolute flex gap-8 transition-all duration-200 ease-out"
                                style={{
                                    left: (password.length > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                                    top: (password.length > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                                }}
                            >
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                            </div>
                        </div>

                        {/* Yellow tall rectangle character - Front right */}
                        <div
                            ref={yellowRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '310px',
                                width: '140px',
                                height: '230px',
                                backgroundColor: '#E8D754',
                                borderRadius: '70px 70px 0 0',
                                zIndex: 4,
                                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            {/* Eyes - just pupils, no white */}
                            <div
                                className="absolute flex gap-6 transition-all duration-200 ease-out"
                                style={{
                                    left: (password.length > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                                    top: (password.length > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                                }}
                            >
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                            </div>
                            {/* Horizontal line for mouth */}
                            <div
                                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                                style={{
                                    left: (password.length > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                                    top: (password.length > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-20 flex items-center gap-8 text-sm text-white/60">
                    <a href="#" className="hover:text-white transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                        Contact
                    </a>
                </div>
            </div>

            {/* Right Login Section - Glass Card */}
            <div className="flex items-center justify-center p-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-sm"
                    style={{ perspective: 1500 }}
                >
                    <motion.div
                        className="relative"
                        style={{ rotateX, rotateY }}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                        whileHover={{ z: 10 }}
                    >
                        <div className="relative group">
                            {/* Card glow effect */}
                            <motion.div
                                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                                animate={{
                                    boxShadow: [
                                        "0 0 10px 2px rgba(255,255,255,0.03)",
                                        "0 0 15px 5px rgba(255,255,255,0.05)",
                                        "0 0 10px 2px rgba(255,255,255,0.03)"
                                    ],
                                    opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatType: "mirror"
                                }}
                            />

                            {/* Traveling light beam effect */}
                            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                                {/* Top light beam */}
                                <motion.div
                                    className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                                    initial={{ filter: "blur(2px)" }}
                                    animate={{
                                        left: ["-50%", "100%"],
                                        opacity: [0.3, 0.7, 0.3],
                                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                    }}
                                    transition={{
                                        left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                                        opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                                        filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" }
                                    }}
                                />

                                {/* Right light beam */}
                                <motion.div
                                    className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                                    initial={{ filter: "blur(2px)" }}
                                    animate={{
                                        top: ["-50%", "100%"],
                                        opacity: [0.3, 0.7, 0.3],
                                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                    }}
                                    transition={{
                                        top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                                        opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                                        filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 }
                                    }}
                                />

                                {/* Bottom light beam */}
                                <motion.div
                                    className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                                    initial={{ filter: "blur(2px)" }}
                                    animate={{
                                        right: ["-50%", "100%"],
                                        opacity: [0.3, 0.7, 0.3],
                                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                    }}
                                    transition={{
                                        right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                                        opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                                        filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 }
                                    }}
                                />

                                {/* Left light beam */}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                                    initial={{ filter: "blur(2px)" }}
                                    animate={{
                                        bottom: ["-50%", "100%"],
                                        opacity: [0.3, 0.7, 0.3],
                                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                    }}
                                    transition={{
                                        bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                                        opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                                        filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 }
                                    }}
                                />
                            </div>

                            {/* Card border glow */}
                            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

                            {/* Glass card background */}
                            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
                                {/* Subtle card inner patterns */}
                                <div className="absolute inset-0 opacity-[0.03]"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                                        backgroundSize: '30px 30px'
                                    }}
                                />

                                {/* Mobile Logo */}
                                <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-8 text-white">
                                    <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Sparkles className="size-4 text-white" />
                                    </div>
                                    <span>YourBrand</span>
                                </div>

                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center mb-6"
                                >
                                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 mb-1">Welcome back!</h1>
                                    <p className="text-white/60 text-xs">Please enter your details</p>
                                </motion.div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-medium text-white/80">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="anna@gmail.com"
                                                value={email}
                                                autoComplete="off"
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setIsTyping(true)}
                                                onBlur={() => setIsTyping(false)}
                                                required
                                                className="h-10 pl-10 bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-medium text-white/80">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-10 pr-10 bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                                            <Label
                                                htmlFor="remember"
                                                className="text-xs font-normal cursor-pointer text-white/60 hover:text-white/80 transition-colors"
                                            >
                                                Remember me
                                            </Label>
                                        </div>
                                        <a
                                            href="#"
                                            className="text-xs text-white/60 hover:text-white transition-colors"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    {error && (
                                        <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative group/button mt-4"
                                    >
                                        {/* Button glow effect */}
                                        <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                                        <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                                            <AnimatePresence mode="wait">
                                                {isLoading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center justify-center"
                                                    >
                                                        <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.span
                                                        key="button-text"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center justify-center gap-1 text-sm font-medium"
                                                    >
                                                        Log in
                                                        <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.button>

                                    {/* Divider */}
                                    <div className="relative flex items-center my-4">
                                        <div className="flex-grow border-t border-white/5"></div>
                                        <span className="mx-3 text-xs text-white/40">or</span>
                                        <div className="flex-grow border-t border-white/5"></div>
                                    </div>

                                    {/* Google Sign In */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        className="w-full relative group/google"
                                    >
                                        <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/google:opacity-70 transition-opacity duration-300" />

                                        <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                                            <Mail className="w-4 h-4 text-white/80 group-hover/google:text-white transition-colors duration-300" />
                                            <span className="text-white/80 group-hover/google:text-white transition-colors text-xs">
                                                Log in with Google
                                            </span>
                                        </div>
                                    </motion.button>

                                    {/* Sign Up Link */}
                                    <motion.p
                                        className="text-center text-xs text-white/60 mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Don't have an account?{' '}
                                        <a href="#" className="text-white font-medium hover:underline">
                                            Sign Up
                                        </a>
                                    </motion.p>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
