import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { getMockData, MockData } from "./libs/mock_data";

function App() {
  const initialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<boolean>(false);

  const [pageNum, setPageNum] = useState(0);
  const [data, setData] = useState<Array<MockData>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialized.current && pageNum === 0) return;

    initialized.current = true;

    (async () => {
      setLoading(true);
      const { datas: mockData, isEnd } = (await getMockData(pageNum)) as {
        datas: MockData[];
        isEnd: boolean;
      };
      endRef.current = isEnd;
      setData((prev) => [...prev, ...mockData]);
      setLoading(false);
    })();
  }, [pageNum]);

  useEffect(() => {
    const ref = scrollRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !endRef.current) {
          setPageNum((prev) => prev + 1);
        }
      },
      { threshold: 0.01 },
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, []);

  const totalPrice = useMemo(() => {
    return data.reduce((acc, cur) => acc + cur.price, 0);
  }, [data]);

  return (
    <div>
      <div>total price: {totalPrice}</div>
      <ul>
        {data.map((item) => (
          <div className="card" key={item.productId}>
            <p>{item.productId}</p>
            <div>{item.productName}</div>
            <div>price: {item.price}</div>
            <div>boughtDate: {item.boughtDate}</div>
          </div>
        ))}
      </ul>
      {loading ? <div>loading...</div> : <div ref={scrollRef} />}
    </div>
  );
}

export default App;
