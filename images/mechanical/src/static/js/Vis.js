"use strict";

const INDEX_OFFSET = 1932
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 680;
const ITEMS_AMOUNT = 48332;

export default class Vis {
    constructor() {
        this.context = this.getContext();
        this.reviewedItems = [];

        this.render();
        //fetch items
        this.getReviewedItems();
    }

    getContext() {
        let canvas = document.querySelector('canvas');
        let parent = canvas.closest('div');
        /* canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight; */
        canvas.width = CANVAS_HEIGHT;
        canvas.height = CANVAS_HEIGHT;
        return canvas.getContext('2d');
    }

    async getReviewedItems() {
        const resp = await fetch('https://api.datacratie.cc/approvals');
        this.reviewedItems = await resp.json();

        this.renderLastItems();
        this.renderPercentage();
        this.render();
    }

    renderLastItems() {
        const lastItems = this.reviewedItems.slice(this.reviewedItems.length - 6, this.reviewedItems.length - 1);
        const table = document.getElementById('last-items');
        lastItems.forEach((item, i) => {
            const row = table.insertRow(i + 1);
            row.insertCell(0).innerHTML = item.annotationUUID;
            row.insertCell(1).innerHTML = item.collection;
            row.insertCell(2).innerHTML = item.created_at;
            row.insertCell(3).innerHTML = item.workerID;
            if (item.approved) {
                row.insertCell(4).innerHTML = "<div class='box red'></div>";
            } else {
                row.insertCell(4).innerHTML = "<div class='box green'></div>";
            }

        })
    }

    renderPercentage() {
        document.getElementById('percentage').innerHTML = `${parseFloat(this.reviewedItems.length / ITEMS_AMOUNT)} %`;
    }

    render() {
        this.context.lineWidth = 1;
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        let cols = 220;
        let rows = 220;
        let size = 3;
        let offset = 0;

        let index = 0;
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                if (index < ITEMS_AMOUNT) {
                    let item = this.getItem(index + INDEX_OFFSET);
                    if (!item) {
                        // this.context.strokeStyle = '#000';
                        // this.context.strokeRect(offset + i * size, offset + j * size, size, size);
                        this.context.fillStyle = 'rgba(125, 125, 125, 0.5)';
                        this.context.fillRect(offset + i * size, offset + j * size, size-1, size-1);
                    } else if (item.approved) {
                        this.context.fillStyle = 'rgba(0, 255, 0, 1)';
                        this.context.fillRect(offset + i * size, offset + j * size, size, size);
                    } else if (!item.approved) {
                        this.context.fillStyle = 'rgba(255, 0, 0, 1)';
                        this.context.fillRect(offset + i * size, offset + j * size, size, size);

                    }
                }
                index++;
            }
        }
    }

    getItem(index) {
        let items = this.reviewedItems.filter(item => {
            if (item.annotationUUID == index) {
                return item
            }
        });

        if (items.length) {
            return items[0]
        } else {
            return null;
        }
    }
}