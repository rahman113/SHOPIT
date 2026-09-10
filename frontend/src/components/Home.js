import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import MetaData from './layout/MetaData'
import Product from './product/Product'
import Loader from './layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { getProducts } from '../actions/productActions'

const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({ match, history }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(
        state => state.products
    )

    const keyword = match.params.keyword

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating))
    }, [dispatch, alert, error, keyword, currentPage, price, category, rating])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productsCount
    if (keyword) {
        count = filteredProductsCount
    }

    const clearFiltersHandler = () => {
        setCategory('')
        setPrice([1, 1000])
        setRating(0)
        setCurrentPage(1)
        history.push(keyword ? `/search/${keyword}` : '/')
    }

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={'Buy Best Products Online'} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: 'top',
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />

                                            <hr className="my-5" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">Categories</h4>

                                                {/* Clear Filters Button */}
                                                {(category || rating > 0 || price[0] !== 1 || price[1] !== 1000) && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary mb-3"
                                                        onClick={clearFiltersHandler}
                                                    >
                                                        Clear Filters
                                                    </button>
                                                )}

                                                <ul className="pl-0">
                                                    {categories.map(cat => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none',
                                                                fontWeight: category === cat ? 'bold' : 'normal',
                                                                color: category === cat ? '#fa9c23' : 'inherit'
                                                            }}
                                                            key={cat}
                                                            onClick={() => {
                                                                const newCat = category === cat ? '' : cat
                                                                setCategory(newCat)
                                                                setCurrentPage(1)

                                                                const encodedCat = encodeURIComponent(newCat)

                                                                if (newCat) {
                                                                    history.push(
                                                                        `/search/${keyword}?category=${encodedCat}`
                                                                    )
                                                                } else {
                                                                    history.push(`/search/${keyword}`)
                                                                }
                                                            }}
                                                        >
                                                            {cat}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">Ratings</h4>

                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                        >
                                                            <div className="rating-outer">
                                                                <div
                                                                    className="rating-inner"
                                                                    style={{
                                                                        width: `${star * 20}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products && products.length > 0 ? (
                                                products.map(product => (
                                                    <Product key={product._id} product={product} col={4} />
                                                ))
                                            ) : (
                                                <div className="col-12 text-center my-5">
                                                    <i className="fa fa-search fa-4x text-muted mb-3"></i>
                                                    <h2 className="text-secondary">No Products Found</h2>
                                                    <p className="text-muted">
                                                        No items match your selected category, price range, or filter criteria.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : products && products.length > 0 ? (
                                products.map(product => <Product key={product._id} product={product} col={3} />)
                            ) : (
                                <div className="col-12 text-center my-5">
                                    <i className="fa fa-search fa-4x text-muted mb-3"></i>
                                    <h2 className="text-secondary">No Products Found</h2>
                                </div>
                            )}
                        </div>
                    </section>

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home