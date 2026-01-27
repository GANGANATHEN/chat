"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Buy_Crypto_Data } from "../../data/data";
import Image from "next/image";
import Img1 from "../../../../public/next.svg";
import Img2 from "../../../../public/next.svg";
import Img5 from "../../../../public/next.svg";
import { curveMonotoneX } from "d3-shape";
import { BitcoinOfferDetails } from "../../data/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip,
  Customized,
  ResponsiveContainer,
  Layer,
} from "recharts";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
import Img3 from "../../../../public/next.svg";
import Img4 from "../../../../public/next.svg";
import { useParams, useRouter } from "next/navigation";
// import { CloudCog, LogIn } from "lucide-react";

const Buy_Crypto = ({ item }) => {
  const params = useParams();
  const page = Number(params.news) || 1;

  const TOTAL_ITEMS = 700;
  const ROWS_PER_PAGE = 160;
  const totalPages = Math.ceil(TOTAL_ITEMS / ROWS_PER_PAGE); // 5

  const [boxId, setBoxId] = useState(0);
  const [showHover, setShowHover] = useState(false);
  //  --------------------------------------------------------------
  const CHART_HEIGHT = 200;
  // ---------------------------------------------------------------
  const [rowpage, setRowpage] = useState(16);
  const router = useRouter();
  // useEffect(() => {
  //   console.log({ TOTAL_ITEMS, ROWS_PER_PAGE, totalPages });
  // }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("Buy_Crypto_Pagination", JSON.stringify(page));
  //   }
  // }, [page]);

  const handleMouseEnter = (id) => {
    setBoxId(id);
    setShowHover(true);
  };

  const handleLeave = () => {
    setShowHover(false);
  };

  const [showContent, setShowContent] = useState(false);
  const SelectcontainerRef = useRef();
  const handleSearchContent = () => {
    setShowContent(!showContent);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        SelectcontainerRef.current &&
        !SelectcontainerRef.current.contains(event.target)
      ) {
        setShowContent(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showContent]);

  // pagination functionality

  const startIndex = page * rowpage;
  const endIndex = startIndex - rowpage;
  // let displayData = Buy_Crypto_Data.slice(endIndex, startIndex);

  function seededOffset(seed, min, max) {
    const x = Math.sin(seed) * 10000; // deterministic random
    const rand = x - Math.floor(x); // 0-1
    return Math.floor(rand * (max - min + 1)) + min;
  }

  function generateDummyLinesFromPV(data, coinId) {
    return data.map((item, index) => {
      const pv = item.pv;

      return {
        ...item,
        uv: Math.max(0, pv + seededOffset(coinId * 100 + index * 1, -550, 650)),
        qv: Math.max(0, pv + seededOffset(coinId * 200 + index * 2, -400, 430)),
        av: Math.max(0, pv + seededOffset(coinId * 300 + index * 3, -300, 100)),
        xv: Math.max(0, pv + seededOffset(coinId * 400 + index * 4, -450, 250)),
      };
    });
  }

  let displayData = Buy_Crypto_Data.slice(endIndex, startIndex).map((coin) => ({
    ...coin,
    data: generateDummyLinesFromPV(coin.data, coin.id),
  }));

  const handlePagination = (pages) => {
    setPage(pages);
  };

  return (
    <>
      <section
        className="min-[117.5rem]:px-60! bg-red-100 relative z-10 max-[425px]:px-4! min-[325px]:pb-[30px] min-[425px]:px-5! min-[500px]:px-6! 
      sm:px-7! md:px-9! lg:px-12! xl:px-16! w-full h-auto pt-33 pb-10"
      >
        <Link
          href=""
          className="font-archivo font-normal text-[14px] text-[#e6e6e6]"
        >
          Main &gt; Exchange Crypto &gt; Buy Crypto flat
        </Link>
        <h1 className="font-gothic font-normal text-[42px] text-white pt-12">
          Buy crypto with flat
        </h1>

        <div className="w-full flex justify-between pt-9 items-center">
          <p className="font-gothic font-normal text-[32px] text-[#e6e6e6] ">
            Popular coins
          </p>
          {/* <Command className="w-[338px] bg-transparent! relative!">
            <div
              onClick={handleSearchContent}
              className={`bg-[#1c1c1c] w-full!  flex justify-between items-center max-[600px]:h-10! min-[600px]:h-12  ${
                showContent === true ? "rounded-0" : "rounded-[8px]!"
              } pl-6 pr-5`}
            >
              <div className="px-3!">
                <CommandInput
                  placeholder="Search"
                  className="font-archivo! text-[#a6a6a6]! max-lg:text-[14px]! lg:text-[16px]! font-normal!"
                />
              </div>
              <Image
                src={Img5}
                alt="search-icon"
                className="lg:w-6 lg:h-6 max-lg:w-5 max-lg:h-5 object-cover"
              />
            </div>
 
            <div
              ref={SelectcontainerRef}
              className={`pr-1 py-2 bg-[#1c1c1c] ${
                showContent === true ? "block" : "hidden"
              }`}
            >
              <CommandList
                className="view-offer-scroll mr-px! px-0! w-full max-h-[280px]!"
                data-lenis-prevent
              >
                <CommandEmpty className="font-archivo! text-[#a6a6a6] lg:text-[16px] max-lg:text-[14px]">
                  No results found.
                </CommandEmpty>
                <CommandGroup
                  heading="Popular currencies"
                  className="flex [&_[cmdk-group-heading]]:px-3 flex-col gap-2.5  px-0!  overflow-auto! text-[14px]! pt-3! lg:text-[16px]! text-white! font-archivo font-normal "
                >
                  <div className="">
                    {BitcoinOfferDetails.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          handleSelectOneCoin(item.id);
                        }}
                        value={item.sortName}
                        className={`w-full h-12   hover:bg-[#636d14]! cursor-pointer! ${
                          item.id <= 3 ? "block" : "hidden"
                        }`}
                      >
                        <div className="flex! gap-2 items-center! h-full">
                          <p className="w-5 h-5 rounded-[50%]">
                            <Image
                              src={item.img}
                              alt="bit-coin"
                              className="w-full h-full object-cover rounded-[50%]"
                            />
                          </p>
                          <div className="flex flex-col">
                            <p className="text-[#d1d1d1] 2xl:text-[18px] min-[990px]:text-[14px] min-[600px]:text-[16px] max-[600px]:text-[14px] font-archivo font-medium">
                              {item.sortName}{" "}
                              <span className="max-[600px]:text-[14px] min-[990px]:text-[12px] min-[600px]:text-[15px]! text-[#a6a6a6] hide">
                                {item.title}
                              </span>
                            </p>
                            <p className="font-archivo font-normal text-[10px] text-[#d3ed05]">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
                <CommandGroup
                  heading="All currencies"
                  className="flex [&_[cmdk-group-heading]]:px-3 flex-col gap-2.5  px-0!  overflow-auto! text-[14px]! pt-3! lg:text-[16px]! text-white! font-archivo font-normal "
                >
                  <div className="mt-3">
                    {BitcoinOfferDetails.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          handleSelectOneCoin(item.id);
                        }}
                        value={item.sortName}
                        className={`w-full h-12   hover:bg-[#636d14]! cursor-pointer!`}
                      >
                        <div className="flex! gap-2 items-center! h-full">
                          <p className="w-5 h-5 rounded-[50%]">
                            <Image
                              src={item.img}
                              alt="bit-coin"
                              className="w-full h-full object-cover rounded-[50%]"
                            />
                          </p>
                          <div className="flex flex-col">
                            <p className="text-[#d1d1d1] 2xl:text-[18px] min-[600px]:text-[16px] max-[600px]:text-[14px] font-archivo font-medium">
                              {item.sortName}{" "}
                              <span className="max-[600px]:text-[14px] min-[600px]:text-[15px] text-[#a6a6a6] hide">
                                {item.title}
                              </span>
                            </p>
                            <p className="font-archivo font-normal text-[10px] text-[#d3ed05]">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </div>
          </Command> */}
        </div>
        <main className="grid grid-cols-4 grid-rows-4 gap-[83px] pt-12">
          {displayData.map((item) => (
            <div
              key={item.id}
              onMouseLeave={handleLeave}
              onMouseEnter={() => handleMouseEnter(item.id)}
              className={`rounded-[47px] w-full h-[298px]
               shadow-[inset_0_0_28px_0_#d3ed05,inset_0px_4px_6px_3px_#fff,inset_0_0_3px_0_rgba(0,0,0,0.25)] pt-9 pb-[26px] relative`}
            >
              <div className="flex justify-between px-6">
                <div className="flex gap-1.5 items-center">
                  <p className="size-9 ">
                    <Image
                      src={item.coinImg}
                      alt="coin-img"
                      className="w-full h-full object-cover rounded-[50%]"
                    />
                  </p>
                  <div className="flex gap-0.5">
                    <p className="text-white font-archivo font-normal text-[18px]">
                      {item.name}
                    </p>
                    <p className="text-white font-archivo font-normal text-[12px] mt-2">
                      {item.sortName}
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-[18px] w-24 h-[31px] flex items-center gap-[3px] justify-center ${
                    item.value.startsWith("+")
                      ? "bg-[#2323ff] "
                      : "bg-[#fb143e] "
                  }`}
                >
                  <p className="size-[23px]">
                    <Image
                      src={item.value === "+2.34%" ? Img2 : Img1}
                      alt="arrow-down"
                      className="w-full h-full object-cover"
                    />
                  </p>
                  <p className="text-white font-archivo font-medium text-[16px]">
                    {item.value}
                  </p>
                </div>
              </div>
              <p className="font-archivo text-white text-[16px] font-bold px-6 pt-1.5">
                $ {item.price}
              </p>

              {/* graph */}
              <div className="-mt-7 relative w-full h-[200px] overflow-hidden -z-1 rounded-b-[20px]">
                <AreaChart
                  className="gap-0.5 w-full rounded-b-[20px] outline-none! cursor-pointer overflow-hidden!"
                  style={{
                    width: "100%",
                    height: 200,
                    aspectRatio: 1.618,
                    overflow: "hidden",
                  }}
                  data={item.data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    {/* Gradient 1: Smooth Pink/Orange Transition */}
                    <linearGradient
                      id="storke1"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0.1%"
                        stopColor="#ff7144"
                        stopOpacity={0.15}
                      />
                      <stop offset="0.1%" stopColor="#ff8979" stopOpacity={1} />
                      <stop offset="0.1%" stopColor="#ff4dca" stopOpacity={1} />
                      <stop offset="85%" stopColor="#e930ff" stopOpacity={1} />
                      <stop offset="90%" stopColor="#e44d88" stopOpacity={1} />
                      <stop
                        offset="95%"
                        stopColor="#e34e81"
                        stopOpacity={0.6}
                      />
                      <stop offset="100%" stopColor="#e3507a" stopOpacity={1} />
                    </linearGradient>

                    {/* Gradient 2: Blue to Teal with Fade Out */}
                    <linearGradient
                      id="storke2"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0.1%" stopColor="#45afee" stopOpacity="0" />
                      <stop
                        offset="20%"
                        stopColor="#43b1ec"
                        stopOpacity="0.61"
                      />
                      <stop
                        offset="40%"
                        stopColor="#41b3e9"
                        stopOpacity="0.76"
                      />
                      <stop offset="60%" stopColor="#3eb7e5" stopOpacity="1" />
                      <stop offset="80%" stopColor="#23dbbd" stopOpacity="1" />
                      <stop
                        offset="90%"
                        stopColor="#1ee0b7"
                        stopOpacity="0.5"
                      />
                      <stop offset="100%" stopColor="#17eaac" stopOpacity="0" />
                    </linearGradient>

                    {/* Gradient 3: Muted Red to Greenish-Yellow */}
                    <linearGradient
                      id="storke3"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0.1%" stopColor="#c16364" stopOpacity="0" />
                      <stop
                        offset="20%"
                        stopColor="#c16c67"
                        stopOpacity="0.56"
                      />
                      <stop offset="40%" stopColor="#c17168" stopOpacity="1" />
                      <stop offset="60%" stopColor="#c1756a" stopOpacity="1" />
                      <stop offset="80%" stopColor="#c1de8b" stopOpacity="1" />
                      <stop
                        offset="90%"
                        stopColor="#c1e98f"
                        stopOpacity="0.5"
                      />
                      <stop offset="100%" stopColor="#c1ef91" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient
                      id="storke4"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      {/* Starting transparent orange */}
                      <stop offset="0%" stopColor="#ffb844" stopOpacity="0" />

                      {/* Natural progression through the colors */}
                      <stop
                        offset="15%"
                        stopColor="#e79b77"
                        stopOpacity="0.15"
                      />
                      <stop
                        offset="35%"
                        stopColor="#cf7dac"
                        stopOpacity="0.65"
                      />
                      <stop
                        offset="55%"
                        stopColor="#a94dff"
                        stopOpacity="0.85"
                      />
                      <stop offset="70%" stopColor="#b1ff72" stopOpacity="1" />
                      <stop offset="80%" stopColor="#50c2f1" stopOpacity="1" />
                      <stop offset="90%" stopColor="#62a0ff" stopOpacity="1" />

                      {/* Final vibrant color with a slight fade out at the very end */}
                      <stop offset="95%" stopColor="#5e81e9" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ff10d1" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient
                      id="boxGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2f6bff"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2f6bff"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>

                  <filter
                    id="strokeBlur"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" />
                  </filter>
                  {/* active dot style */}

                  <defs>
                    <radialGradient id="active1" x1="0" y1="50" x2="50" y2="1">
                      <stop
                        offset="0.1%"
                        stopColor="#ff731c"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="70%"
                        stopColor="#ff49c8"
                        stopOpacity="0.4"
                      />
                    </radialGradient>
                    <radialGradient id="active2" x1="0" y1="50" x2="50" y2="1">
                      <stop
                        offset="0.1%"
                        stopColor="#ff1caf"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="70%"
                        stopColor="#ff9df1"
                        stopOpacity="0.1"
                      />
                    </radialGradient>
                    <radialGradient id="active3" x1="0" y1="50" x2="50" y2="1">
                      <stop
                        offset="0.1%"
                        stopColor="#fff2fe"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="70%"
                        stopColor="#ffbff6"
                        stopOpacity="0.1"
                      />
                    </radialGradient>
                    <radialGradient id="active4" x1="0" y1="50" x2="50" y2="1">
                      <stop offset="0.1%" stopColor="#fff2fe" stopOpacity="1" />
                      <stop offset="70%" stopColor="#ffbff6" stopOpacity="1" />
                    </radialGradient>
                  </defs>

                  <XAxis dataKey="name" hide />
                  <YAxis hide />

                  <filter id="referenceBlur">
                    <feGaussianBlur stdDeviation="8" />
                  </filter>

                  <defs>
                    {/* GRID BOX PATTERN */}
                    <pattern
                      id="gridPattern"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      {/* vertical line */}
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="red"
                        strokeWidth="0.5"
                      />
                    </pattern>

                    {/* soft overlay gradient (optional but looks premium) */}
                    <linearGradient
                      id="gridOverlay"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ff49c8"
                        stopOpacity={0.12}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2f6bff"
                        stopOpacity={0.04}
                      />
                    </linearGradient>
                    <radialGradient
                      id="grid1"
                      cx="50%"
                      cy="50%"
                      r="50%"
                      fx="50%"
                      fy="50%"
                    >
                      <stop offset="0%" stopColor="#1b193d" />
                      <stop offset="100%" stopColor="#23214c" />
                    </radialGradient>
                  </defs>

                  <ReferenceArea
                    x1={item.data[0].name}
                    x2={item.data[item.data.length - 1].name}
                    y1="dataMin"
                    y2="dataMax"
                    isFront={false}
                    filter="url(#referenceBlur)"
                    ifOverflow="visible"
                    fill={`url(#gridPattern-${item.id})`}
                    stroke="none"
                  />

                  <Tooltip content={() => null} cursor={false} />
                  <defs>
                    {/* GRID PATTERN */}
                    <pattern
                      id={`gridPattern-${item.id}`}
                      width="36"
                      height="16"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="32" height="12" rx="3" fill="url(#grid1)" />
                    </pattern>

                    {/* LINE GRADIENT */}
                    <linearGradient
                      id={`lineGrad-${item.id}`}
                      x1="0"
                      y1="1"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#ff7144" />
                      <stop offset="100%" stopColor="#e930ff" />
                    </linearGradient>

                    {/* Clip to stop top overflow */}
                    <clipPath id={`pv-clip-${item.id}`}>
                      {/* adjust y (6–10px) based on stroke thickness */}
                      <rect x="0" y="8" width="100%" height="100%" />
                    </clipPath>

                    {/* Line gradients */}
                    <linearGradient
                      id="storke1"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ff7144" />
                      <stop offset="100%" stopColor="#e930ff" />
                    </linearGradient>

                    {/* Active dot gradients */}
                    <radialGradient id="active1">
                      <stop offset="0%" stopColor="#ff731c" stopOpacity="0.6" />
                      <stop
                        offset="70%"
                        stopColor="#ff49c8"
                        stopOpacity="0.4"
                      />
                    </radialGradient>

                    <radialGradient id="active2">
                      <stop offset="0%" stopColor="#ff1caf" stopOpacity="0.2" />
                      <stop
                        offset="70%"
                        stopColor="#ff9df1"
                        stopOpacity="0.1"
                      />
                    </radialGradient>

                    <radialGradient id="active3">
                      <stop offset="0%" stopColor="#fff2fe" stopOpacity="0.2" />
                      <stop
                        offset="70%"
                        stopColor="#ffbff6"
                        stopOpacity="0.1"
                      />
                    </radialGradient>

                    <radialGradient id="active4">
                      <stop offset="0%" stopColor="#fff2fe" stopOpacity="1" />
                      <stop offset="70%" stopColor="#ffbff6" stopOpacity="1" />
                    </radialGradient>
                  </defs>

                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip content={() => null} cursor={false} />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="none"
                    fill={`url(#gridPattern-${item.id})`}
                    clipPath={`url(#pv-clip-${item.id})`}
                    isAnimationActive={false}
                    dot={false}
                    curve={curveMonotoneX}
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="url(#storke1)"
                    strokeWidth={2}
                    fill="transparent"
                    curve={curveMonotoneX}
                    activeDot={({ cx, cy }) => (
                      <g>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={15}
                          fill="none"
                          stroke="url(#active1)"
                          strokeWidth={50}
                          opacity={0.4}
                        />
                        <circle cx={cx} cy={cy} r={21} fill="url(#active2)" />
                        <circle cx={cx} cy={cy} r={11} fill="url(#active3)" />
                        <circle cx={cx} cy={cy} r={6} fill="url(#active4)" />
                      </g>
                    )}
                  />
                  <Area
                    type="monotone"
                    activeDot={false}
                    dataKey="uv"
                    stroke="url(#storke2)"
                    strokeWidth={1}
                    fill="transparent"
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    activeDot={false}
                    dataKey="qv"
                    stroke="url(#storke3)"
                    strokeWidth={1}
                    fill="transparent"
                    /* Optional: If you want a slight glow under the line */
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    activeDot={false}
                    dataKey="av"
                    filter="url(#strokeBlur)"
                    stroke="url(#storke4)"
                    strokeWidth={1}
                    fill="transparent"
                    /* Optional: If you want a slight glow under the line */
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    activeDot={false}
                    dataKey="xv"
                    stroke="url(#storke3)"
                    strokeWidth={1}
                    fill="transparent"
                    /* Optional: If you want a slight glow under the line */
                    fillOpacity={1}
                  />
                </AreaChart>

                <svg
                  className="absolute z-1 inset-0 pointer-events-none"
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <filter
                      id="strokeBlur"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" />
                    </filter>
                    <linearGradient
                      id={`bottomShadow-${item.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
                    </linearGradient>
                  </defs>

                  {(() => {
                    const pvValues = item.data.map((d) => d.pv);
                    const minY = Math.min(...pvValues);
                    const maxY = Math.max(...pvValues);

                    const TOTAL_CHART_HEIGHT = 100;
                    const ABSOLUTE_MAX = 6500;
                    const ABSOLUTE_MIN = 0;

                    const normalize = (value) => {
                      const ratio =
                        (value - ABSOLUTE_MIN) / (ABSOLUTE_MAX - ABSOLUTE_MIN);
                      return TOTAL_CHART_HEIGHT - ratio * TOTAL_CHART_HEIGHT;
                    };

                    // bottom shadow (already existing)
                    const minLineY = normalize(minY);
                    const GAP_IN_UNITS = 8;
                    const shadowStartY = minLineY + GAP_IN_UNITS;
                    const finalShadowY = Math.min(shadowStartY, 95);
                    let shadowHeight = 100 - finalShadowY;
                    if (shadowHeight < 5) shadowHeight = 5;

                    //  NEW: first & last value
                    const firstValue = item.data[0].pv;
                    const lastValue = item.data[item.data.length - 1].pv;

                    const firstY = normalize(firstValue);
                    const lastY = normalize(lastValue);

                    const SIDE_WIDTH = 10;
                    const CHART_WIDTH = 100;

                    return (
                      <>
                        {/* Bottom shadow */}
                        <rect
                          x="0"
                          y={finalShadowY}
                          width="100"
                          height={shadowHeight}
                          filter={`url(#strokeBlur-${item.id})`}
                          fill={`url(#bottomShadow-${item.id})`}
                        />

                        {/* LEFT side shadow */}
                        <rect
                          x="0"
                          y={firstY}
                          width={SIDE_WIDTH}
                          height={100 - firstY}
                          fill="rgba(0,0,0,0.15)"
                        />

                        {/* RIGHT side shadow */}
                        <rect
                          x={CHART_WIDTH - SIDE_WIDTH}
                          y={lastY}
                          width={SIDE_WIDTH}
                          height={100 - lastY}
                          fill="rgba(0,0,0,0.15)"
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* hover content */}
            </div>
          ))}
        </main>

        {/* pagination */}
        <div className="flex w-full justify-center gap-3 pt-22 pb-10">
          <p className="size-6">
            <Image
              src={Img4}
              alt="arrow-left-icon"
              className="w-full h-full object-cover"
            />
          </p>
          {/* ---------------------------------------------------- */}
          <div className="flex gap-2 items-center">
            {/* PAGE 1 */}
            <Link
              href="/hlo/1"
              className={`size-7 flex justify-center items-center rounded
      ${
        page === 1
          ? "bg-black border border-white text-white"
          : "bg-yellow-400 text-black"
      }
    `}
            >
              1
            </Link>

            {/* PAGE 2 */}
            {totalPages >= 2 && (
              <Link
                href="/hlo/2"
                className={`size-7 flex justify-center items-center rounded
        ${
          page === 2
            ? "bg-black border border-white text-white"
            : "bg-yellow-400 text-black"
        }
      `}
              >
                2
              </Link>
            )}

            {/* DOTS */}
            {totalPages > 2 && <span className="px-1 text-white">...</span>}

            {/* LAST PAGE */}
            {totalPages > 2 && (
              <Link
                href={`/hlo/${totalPages}`}
                className={`size-7 flex justify-center items-center rounded
        ${
          page === totalPages
            ? "bg-black border border-white text-white"
            : "bg-yellow-400 text-black"
        }
      `}
              >
                {totalPages}
              </Link>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          <p className="size-6">
            <Image
              src={Img3}
              alt="arrow-left-icon"
              className="w-full h-full object-cover"
            />
          </p>
        </div>
      </section>
    </>
  );
};

export default Buy_Crypto;
