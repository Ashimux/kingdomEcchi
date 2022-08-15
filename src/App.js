import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import { Button, Pagination, Card, Spin } from 'antd'
import './App.css';
import 'antd/dist/antd.css';

const userEnum = {
  mc: '@megacosplay',
  bpv: '@bestpornvideos'
}

const buttons = [
  {
    label: 'Cosplay',
    user: userEnum.mc
  },
  {
    label: 'Porn',
    user: userEnum.bpv
  }
]

function App() {
  const [userSelected, setUserSelected] = useState(userEnum.mc)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchData = async (user, pages) => {
    setLoading(true)
    const fetchedData = await fetch('https://api.lbry.tv/api/v1/proxy', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'method': 'claim_search',
          'params': {
              'channel': user,
              'order_by': 'release_time',
              'page': pages,
              'page_size': 10
          }
      })
    }).then(res=>res.json())
    const filteredData = fetchedData?.result?.items.filter(item => item?.value?.title && item?.value?.thumbnail?.url)
    setTotalPages(fetchedData?.result?.total_items)
    setData(filteredData)
    setLoading(false)
  }

  useEffect(()=> {
    fetchData(userSelected, currentPage)
  }, [currentPage, userSelected])

  return (
    <div className='root'>
      <div className='select-container'>
        {
          buttons.map((button) => (
            <Button
              type={userSelected === button?.user ? 'primary' : ''}
              key={button?.label}
              onClick={() => setUserSelected(button?.user)}
            >
              {button?.label}
            </Button>
          ))
        }
      </div>
      <div className='results-container'>
      {
        data.map(item => (
          <Card
            hoverable
            style={{
              width: 300
            }}
            cover={<img className='img-cover' src={item?.value?.thumbnail?.url} />}
            onClick={() => {
              window.location.href = `https://lbry.tv/$/embed/${item?.name}/${item?.claim_id}`
            }}
          >
            {item?.value?.title}
          </Card>
        ))
      }
      </div>
      <Pagination
        key={totalPages}
        defaultCurrent={1}
        total={totalPages}
        onChange={(pageNumber) => {
          setCurrentPage(pageNumber)
        }} />
      {
        loading && (
          <div className='spinner'>
            <Spin size='large'/>
          </div>
        )
      }
    </div>
  );
}

export default App;
