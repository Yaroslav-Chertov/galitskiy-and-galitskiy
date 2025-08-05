import Wine from "../Wine.jsx"

const WineDetails = ({ data, wineCode }) => {
    // const wine = data.wines.items.find((item) => item.code === wineCode);

    // if (!wine) return <div>Вино не найдено</div>;

    return (
        <div style="display: none;" data-route="wine-details">
            <div class="main main--wine" data-elt="wineDetailsRender">
                <Wine wine={data.wines.items[0]} similarWines={data.wines.items.filter((w) => w.type === data.wines.items[0].type)} />
            </div>
        </div>
    )
}

export default WineDetails
