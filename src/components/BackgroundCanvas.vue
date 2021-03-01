<template>
    <canvas id="canvas" class="custom-canvas"></canvas>
</template>
<script>
    export default {
        mounted() {
            const compatibleFrame = () => {
                let lastTime = 0;
                let prefixes = ['ms', 'webkit', 'o', 'moz']; //各浏览器前缀

                let requestAnimationFrame = window.requestAnimationFrame;
                let cancelAnimationFrame = window.cancelAnimationFrame;

                let prefix;
                //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
                for (let i = 0; i < prefixes.length; i++) {
                    if (requestAnimationFrame && cancelAnimationFrame) {
                        break;
                    }
                    prefix = prefixes[i];
                    requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
                    cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
                }

                //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
                if (!requestAnimationFrame || !cancelAnimationFrame) {
                    requestAnimationFrame = function (callback) {
                        let currTime = new Date().getTime();
                        //为了使setTimteout的尽可能的接近每秒60帧的效果
                        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        let id = window.setTimeout(function () {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                    cancelAnimationFrame = function (id) {
                        window.clearTimeout(id);
                    };
                }

                window.requestAnimationFrame = requestAnimationFrame;
                window.cancelAnimationFrame = cancelAnimationFrame;
            };
            compatibleFrame();//调用一次兼容 requestAnimationFrame

            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            const rndCl = () => Math.floor(Math.random() * 100 + 125);
            let width = window.innerWidth;
            let height = window.innerHeight;
            for (let i = 0; i < this.dotsNum; i++) {
                this.colorList.push(`rgba(${rndCl()},${rndCl()},${rndCl()},1)`)
            }
            let base_list = [];
            canvas.width = width;
            canvas.height = height;
            let once = true;
            window.onresize = () => {
                canvas.width = width = window.innerWidth;
                canvas.height = height = window.innerHeight;
            };

            // 绘制圆
            const drawRounds = (obj) => {
                let {x, y, r, color} = obj;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                if (this.isColor) {
                    ctx.fillStyle = color;
                } else {
                    ctx.fillStyle = this.roundColor
                }
                ctx.fill();
                ctx.closePath();
            }

            //判断移动方向
            const controlDirection = (obj) => {
                if (obj.x >= (width - obj.r)) {
                    obj.controlX = "left";
                } else if (obj.x <= parseInt(obj.r / 2)) {
                    obj.controlX = "right";
                }

                if (obj.y >= (height - obj.r)) {
                    obj.controlY = "bottom";
                } else if (obj.y <= parseInt(obj.r / 2)) {
                    obj.controlY = "top"
                }
                return obj
            }

            //划线
            const drawLine = (list) => {
                list.map((item, ) => {
                    ctx.beginPath();
                    ctx.moveTo(item.x1, item.y1);
                    ctx.lineTo(item.x2, item.y2);
                    ctx.LineWeight = 1;
                    if (this.isColor) {
                        ctx.strokeStyle = item.color;
                    } else {
                        ctx.strokeStyle = this.lineColor
                    }
                    ctx.stroke();
                    ctx.closePath();
                })
            }

            //绘制
            const draw = (list) => {
                let dots_arr = [];
                let line_arr = [];

                list.map((item) => {
                    let xy = controlDirection(item);
                    let obj = roundMove(xy);
                    dots_arr.push(obj);
                });
                dots_arr.map((item1) => {
                    dots_arr.map((item2) => {
                        if (item1 !== item2) {
                            let x = item1.x - item2.x;
                            let y = item1.y - item2.y;
                            if (Math.abs(x) < 150 && Math.abs(y) < 150) {
                                let obj = {
                                    x1: item1.x,
                                    y1: item1.y,
                                    x2: item2.x,
                                    y2: item2.y,
                                    color: item1.color
                                }
                                line_arr.push(obj)
                            }
                        }
                    })
                })
                drawLine(line_arr);

                dots_arr.map((item, index) => {
                    drawRounds(item, index)
                })

                base_list = dots_arr;

                if (!once) {
                    once = true;
                }
            }


            const reDraw = () => {
                ctx.clearRect(0, 0, width, height);
                draw(base_list);
                requestAnimationFrame(reDraw)
            };
            requestAnimationFrame(reDraw)

            //移动
            const roundMove = (obj) => {
                switch (obj.controlX) {
                    case "right":
                        obj.x++;
                        break;
                    case "left":
                        obj.x--;
                        break;
                    default:
                }
                switch (obj.controlY) {
                    case "top":
                        obj.y++;
                        break;
                    case "bottom":
                        obj.y--;
                        break;
                    default:
                }
                return obj
            }

            //创造圆点
            const creatDots = () => {
                let arr = [];
                for (let i = 0; i < this.dotsNum; i++) {
                    let obj = {};
                    obj.x = parseInt(Math.random() * width);
                    obj.y = parseInt(Math.random() * height);
                    obj.r = parseInt(Math.random() * 7 + 4);
                    obj.controlX = parseInt(Math.random() * 10) > 5 ? "left" : "right"
                    obj.controlY = parseInt(Math.random() * 10) > 5 ? "bottom" : "top"

                    obj.color = `rgba(${rndCl()},${rndCl()},${rndCl()},.3)`

                    arr.push(obj)
                }
                return arr
            };

            draw(creatDots());

            //鼠标移动
            const moveXY = (event) => {
                let obj = {};
                obj.x = event.clientX;
                obj.y = event.clientY;
                obj.r = 0;
                base_list[0] = obj;
                base_list[0]["r"] = 1;
            }

            //鼠标点击
            const addXY = (event) => {
                let obj = {};
                obj.x = event.clientX;
                obj.y = event.clientY;
                obj.r = parseInt(Math.random() * 10);
                obj.color = `rgba(${rndCl()},${rndCl()},${rndCl()},.3)`;
                obj.controlX = parseInt(Math.random() * 10) > 5 ? 'left' : 'right'
                obj.controlY = parseInt(Math.random() * 10) > 5 ? 'bottom' : 'top'
                if(base_list.length<=120){
                    base_list.push(obj);
                }

            };

            window.addEventListener("mousemove", moveXY);
            window.addEventListener("click", addXY)
        },
        data() {
            return {
                colorList: [],
            }
        },
        props: {
            dotsNum: {
                type: Number,
                default: 75
            },
            isColor: {
                type: Boolean,
                default: true
            },
            roundColor: {
                type: String,
                default: "#999"
            },
            lineColor: {
                type: String,
                default: "#ccc"
            }

        }
    }
</script>
<style scoped>
    .custom-canvas {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgb(239, 245, 249);
        /*// rgb(244, 247, 249);*/
        box-sizing: border-box;
        z-index: 0;
    }
</style>
