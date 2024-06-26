import { ArrowRightOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import GistGridLayout from '../../components/GistGridLayout/GistGridLayout';
import GistListLayout from '../../components/GistListLayout';
import { fetchGists } from '../../slices/actions';
import { AppDispatch, RootState } from '../../store';
import './Homepage.scss';
import GridLayoutIcon from '../../components/Icons/GridLayoutIcon';
import ListLayoutIcon from '../../components/Icons/ListLayoutIcon';
import Skeleton from '../../components/Skeleton';

const HomePage: React.FC = () => {
  const [gridLayout, setGridLayout] = React.useState<boolean>(true);
  const dispatch: AppDispatch = useDispatch();
  const loadingGist = useSelector((state: RootState) => state.gists.loading);
  const totalPages = useSelector((state: RootState) => state.gists.totalPages);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')!) || 1;

  useEffect(() => {
    dispatch(fetchGists(page));
    return () => {};
  }, [page, dispatch]);

  const handlePageChange = (next: boolean) => {
    if (next) {
      setSearchParams({
        page: (page + 1).toString()
      });
    } else {
      setSearchParams({
        page: (page - 1).toString()
      });
    }
  };

  return (
    <div className="py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal">Public Gists</h1>
        <div className="flex justify-between items-center w-14">
          <div
            data-testid="grid-layout-button"
            className="grid-layout-icon-container"
            onClick={() => setGridLayout(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setGridLayout(true);
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: gridLayout ? '#E3E3E3' : 'white'
            }}
          >
            <GridLayoutIcon />
          </div>
          <div
            style={{
              backgroundColor: !gridLayout ? '#E3E3E3' : 'white'
            }}
            data-testid="list-layout-button"
            className="list-layout-icon-container "
            onClick={() => setGridLayout(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setGridLayout(false);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <ListLayoutIcon />
          </div>
        </div>
      </div>

      {loadingGist ? <Skeleton /> : gridLayout ? <GistGridLayout /> : <GistListLayout />}

      <div className="mt-10 flex justify-between items-center w-full">
        <div />
        <button
          onClick={() => {
            handlePageChange(true);
          }}
          className="button"
        >
          Next page <ArrowRightOutlined />
        </button>
        <div className="">
          page
          <span className="current-page">{page}</span>
          of {totalPages}
          <button
            disabled={page === 1}
            onClick={() => {
              handlePageChange(false);
            }}
            className="button-small"
          >
            {'<'}
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => {
              handlePageChange(true);
            }}
            className="button-small"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
