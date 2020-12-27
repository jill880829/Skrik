import React from "react";

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
        document.removeEventListener('click', this._handleClick);
        document.removeEventListener('scroll', this._handleScroll);
    }

    _handleContextMenu = (event) => {
        event.preventDefault();

        this.setState({ visible: true });

        const clickX = event.clientX;
        const clickY = event.clientY;               //事件發生時滑鼠的Y座標
        const screenW = window.innerWidth;   //文件顯示區的寬度
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;     //右鍵選單本身元素的寬度
        const rootH = this.root.offsetHeight;

        // right為true，說明滑鼠點選的位置到瀏覽器的右邊界的寬度可以放contextmenu。

        // 否則，選單放到左邊。 // top和bottom，同理。

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            this.root.style.left = `${clickX + 15}px`;
        }

        if (left) {
            this.root.style.left = `${clickX - rootW - 15}px`;
        }

        if (top) {
            this.root.style.top = `${clickY + 15}px`;
        }

        if (bottom) {
            this.root.style.top = `${clickY - rootH - 15}px`;
        }
    };

    _handleClick = (event) => {
        const { visible } = this.state;
        const wasOutside = !(event.target.contains === this.root);

        if (wasOutside && visible) this.setState({ visible: false, });
    };

    _handleScroll = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false, });
    };

    render() {
        const { visible } = this.state;

        return (
            visible ?
                <div ref={ref => { this.root = ref }} className="contextMenu">
                    <div>右鍵選單內容</div>
                </div> : null
        )


    };
}
export default ContextMenu;
