'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    class EventListener {
        constructor(context, handler, times = Infinity, frequency = 1) {
            this.context = context;
            this.handler = handler;
            this.times = times;
            this.frequency = frequency;
        }
    }

    function addListener(event, listener) {
        if (!events.has(event)) {
            events.set(event, []);
        }
        events.get(event).push({ listener, count: 0 });
    }

    function deleteListeners(event, context) {
        const result = events.get(event).filter(element => element.listener.context !== context);
        events.set(event, result);
    }

    function respond(event) {
        events.get(event).forEach(element => {
            if (element.count % element.listener.frequency === 0 &&
                element.listener.times > 0) {
                element.listener.handler.call(element.listener.context);
                element.listener.times--;
            }
            element.count++;
        });
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            const listener = new EventListener(context, handler);
            addListener(event, listener);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (const key of events.keys()) {
                if (key.startsWith(event + '.') || key === event) {
                    deleteListeners(key, context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let currentEvent = event + '.';
            do {
                const index = currentEvent.lastIndexOf('.');
                currentEvent = currentEvent.substring(0, index);
                if (events.has(currentEvent)) {
                    respond(currentEvent);
                }
            } while (currentEvent.includes('.'));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            const listener = new EventListener(context, handler, times);
            addListener(event, listener);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            const listener = new EventListener(context, handler, undefined, frequency);
            addListener(event, listener);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
