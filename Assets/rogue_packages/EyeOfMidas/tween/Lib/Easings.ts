const EASINGS = {
    Linear: {
        EaseNone: (percentageComplete) => percentageComplete,
    },
    Quadratic: {
        EaseIn: (percentageComplete) => percentageComplete * percentageComplete,
        EaseOut: (percentageComplete) => -percentageComplete * (percentageComplete - 2),
        EaseInOut: (percentageComplete) => {
            if ((percentageComplete *= 2) < 1) return 0.5 * percentageComplete * percentageComplete;
            return - 0.5 * (--percentageComplete * (percentageComplete - 2) - 1);
        },
    },
    Cubic: {
        EaseIn: (percentageComplete) => percentageComplete * percentageComplete * percentageComplete,
        EaseOut: (percentageComplete) => --percentageComplete * percentageComplete * percentageComplete + 1,
        EaseInOut: (percentageComplete) => {
            if ((percentageComplete *= 2) < 1) return 0.5 * percentageComplete * percentageComplete * percentageComplete;
            return 0.5 * ((percentageComplete -= 2) * percentageComplete * percentageComplete + 2);
        },
    },
    Quartic: {
        EaseIn: (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete,
        EaseOut: (percentageComplete) => -(--percentageComplete * percentageComplete * percentageComplete * percentageComplete - 1),
        EaseInOut: (percentageComplete) => {
            if ((percentageComplete *= 2) < 1) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
            return - 0.5 * ((percentageComplete -= 2) * percentageComplete * percentageComplete * percentageComplete - 2);
        },
    },
    Quintic: {
        EaseIn: (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete,
        EaseOut: (percentageComplete) => (percentageComplete = percentageComplete - 1) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 1,
        EaseInOut: (percentageComplete) => {
            if ((percentageComplete *= 2) < 1) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
            return 0.5 * ((percentageComplete -= 2) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 2);
        },
    },
    Sinusoidal: {
        EaseIn: (percentageComplete) => -Math.cos(percentageComplete * Math.PI / 2) + 1,
        EaseOut: (percentageComplete) => Math.sin(percentageComplete * Math.PI / 2),
        EaseInOut: (percentageComplete) => -0.5 * (Math.cos(Math.PI * percentageComplete) - 1),
    },
    Exponential: {
        EaseIn: (percentageComplete) => {
            return percentageComplete == 0 ? 0 : Math.pow(2, 10 * (percentageComplete - 1));
        },
        EaseOut: (percentageComplete) => {
            return percentageComplete == 1 ? 1 : - Math.pow(2, - 10 * percentageComplete) + 1;
        },
        EaseInOut: (percentageComplete) => {
            if (percentageComplete == 0) return 0;
            if (percentageComplete == 1) return 1;
            if ((percentageComplete *= 2) < 1) return 0.5 * Math.pow(2, 10 * (percentageComplete - 1));
            return 0.5 * (- Math.pow(2, - 10 * (percentageComplete - 1)) + 2);
        },
    },
    Circular: {
        EaseIn: (percentageComplete) => -(Math.sqrt(1 - percentageComplete * percentageComplete) - 1),
        EaseOut: (percentageComplete) => Math.sqrt(1 - (--percentageComplete * percentageComplete)),
        EaseInOut: (percentageComplete) => {
            if ((percentageComplete /= 0.5) < 1) return - 0.5 * (Math.sqrt(1 - percentageComplete * percentageComplete) - 1);
            return 0.5 * (Math.sqrt(1 - (percentageComplete -= 2) * percentageComplete) + 1);
        },
    },
    Elastic: {
        EaseIn: (percentageComplete) => {
            var s, a = 0.1, p = 0.4;
            if (percentageComplete == 0) return 0; if (percentageComplete == 1) return 1; if (!p) p = 0.3;
            if (!a || a < 1) { a = 1; s = p / 4; }
            else s = p / (2 * Math.PI) * Math.asin(1 / a);
            return - (a * Math.pow(2, 10 * (percentageComplete -= 1)) * Math.sin((percentageComplete - s) * (2 * Math.PI) / p));
        },
        EaseOut: (percentageComplete) => {
            var s, a = 0.1, p = 0.4;
            if (percentageComplete == 0) return 0; if (percentageComplete == 1) return 1; if (!p) p = 0.3;
            if (!a || a < 1) { a = 1; s = p / 4; }
            else s = p / (2 * Math.PI) * Math.asin(1 / a);
            return (a * Math.pow(2, - 10 * percentageComplete) * Math.sin((percentageComplete - s) * (2 * Math.PI) / p) + 1);
        },
        EaseInOut: (percentageComplete) => {
            var s, a = 0.1, p = 0.4;
            if (percentageComplete == 0) return 0; if (percentageComplete == 1) return 1; if (!p) p = 0.3;
            if (!a || a < 1) { a = 1; s = p / 4; }
            else s = p / (2 * Math.PI) * Math.asin(1 / a);
            if ((percentageComplete *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (percentageComplete -= 1)) * Math.sin((percentageComplete - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (percentageComplete -= 1)) * Math.sin((percentageComplete - s) * (2 * Math.PI) / p) * 0.5 + 1;
        },
    },
    Back: {
        EaseIn: (percentageComplete) => {
            var s = 1.70158;
            return percentageComplete * percentageComplete * ((s + 1) * percentageComplete - s);
        },
        EaseOut: (percentageComplete) => {
            var s = 1.70158;
            return (percentageComplete = percentageComplete - 1) * percentageComplete * ((s + 1) * percentageComplete + s) + 1;
        },
        EaseInOut: (percentageComplete) => {
            var s = 1.70158 * 1.525;
            if ((percentageComplete *= 2) < 1) return 0.5 * (percentageComplete * percentageComplete * ((s + 1) * percentageComplete - s));
            return 0.5 * ((percentageComplete -= 2) * percentageComplete * ((s + 1) * percentageComplete + s) + 2);
        },
    },
    Bounce: {
        EaseIn: (percentageComplete) => 1 - EASINGS.Bounce.EaseOut(1 - percentageComplete),
        EaseOut: (percentageComplete) => {
            if ((percentageComplete /= 1) < (1 / 2.75)) {
                return 7.5625 * percentageComplete * percentageComplete;
            } else if (percentageComplete < (2 / 2.75)) {
                return 7.5625 * (percentageComplete -= (1.5 / 2.75)) * percentageComplete + 0.75;
            } else if (percentageComplete < (2.5 / 2.75)) {
                return 7.5625 * (percentageComplete -= (2.25 / 2.75)) * percentageComplete + 0.9375;
            } else {
                return 7.5625 * (percentageComplete -= (2.625 / 2.75)) * percentageComplete + 0.984375;
            }
        },
        EaseInOut: (percentageComplete) => {
            if (percentageComplete < 0.5) return EASINGS.Bounce.EaseIn(percentageComplete * 2) * 0.5;
            return EASINGS.Bounce.EaseOut(percentageComplete * 2 - 1) * 0.5 + 0.5;
        },
    },
}

export default EASINGS