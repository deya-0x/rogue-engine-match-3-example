import EASINGS from './Easings'
export default class Tween {
    static activeTweens: Tween[] = []
    static idCounter: number = 0

    id: number
    obj: any
    objStart: any
    objTarget: any
    startTime: number
    endTime: number
    easing: Function
    completedCallback: Function

    static create(obj, targetProperties, duration, easing = EASINGS.Linear.EaseNone, completedCallback = () => { }) {
        let singleTween = new Tween();
        singleTween.id = ++Tween.idCounter;
        singleTween.obj = obj;
        singleTween.objStart = {};
        singleTween.objTarget = targetProperties;
        Tween.saveProperties(singleTween.objStart, obj, targetProperties);
        singleTween.startTime = new Date().getTime();
        singleTween.endTime = singleTween.startTime + duration;
        singleTween.easing = easing;
        singleTween.completedCallback = completedCallback;
        Tween.activeTweens.push(singleTween);
        return singleTween.id;
    }
    static cancel(tweenId): Tween | undefined {
        let tween = Tween.activeTweens.find(tween => tweenId == tween.id);
        if (tween) {
            let index = Tween.activeTweens.indexOf(tween);
            Tween.activeTweens.splice(index, 1);
            return tween;
        }
        return
    };

    static stop(tweenId) {
        let tween = Tween.cancel(tweenId);
        tween?.completedCallback();
        return tween;
    };

    static saveProperties(singleTweenStart, obj, targetProperties) {
        for (let property in targetProperties) {
            let startValue = obj[property];
            if (typeof startValue == "object") {
                singleTweenStart[property] = {};
                Tween.saveProperties(singleTweenStart[property], obj[property], targetProperties[property]);
                continue;
            }
            singleTweenStart[property] = startValue;
        }
    }

    static update() {
        let completed: Tween[] = [];
        for (let i = 0; i < Tween.activeTweens.length; i++) {
            let singleTween = Tween.activeTweens[i];
            if (Tween.updateSingleTween(singleTween) == 1) {
                completed.push(singleTween);
            }
        }

        for (let i = 0; i < completed.length; i++) {
            let singleTween = completed[i];
            singleTween.completedCallback();
            let foundIndex = Tween.activeTweens.indexOf(singleTween);
            if (foundIndex != -1) {
                Tween.activeTweens.splice(foundIndex, 1);
            }
        }
    };

    static updateSingleTween(singleTween) {
        let currentTime = new Date().getTime();
        let runTime = currentTime - singleTween.startTime;
        let duration = singleTween.endTime - singleTween.startTime;
        let percentageComplete = Math.min(1, runTime / duration);
        let valueToUpdate = singleTween.easing(percentageComplete);
        Tween.updateProperties(singleTween.obj, singleTween.objStart, singleTween.objTarget, valueToUpdate);
        return percentageComplete;
    }

    static updateProperties(obj, objStart, objTarget, valueToUpdate) {
        for (let property in objStart) {
            let startValue = objStart[property];
            if (typeof startValue == "object") {
                Tween.updateProperties(obj[property], objStart[property], objTarget[property], valueToUpdate);
                continue;
            }
            let endValue = objTarget[property];
            let delta = endValue - startValue;
            obj[property] = startValue + (delta * valueToUpdate);
        }
    };
};