import { useState } from "react";
import CardComponent from "../components/Card/Card";
import Layout from "../layouts/layout";
import food1 from "../assets/img/food/food1.jpg";
import food2 from "../assets/img/food/food2.jpg";
import food3 from "../assets/img/food/food3.jpg";
import food4 from "../assets/img/food/food4.jpg";
import food5 from "../assets/img/food/food5.jpg";
import food6 from "../assets/img/food/food6.jpg";
import dokki from "../assets/img/food/dokki.jpg";
import Chicken from "../assets/img/food/Chicken.jpg";
import img1 from "../assets/img/cat-jump.gif";
import HeartButton from "../components/HeartButton/HeartButton";
import { pink } from "../components/interfaces/HeartButton.interface";
import HeartSlider from "../components/Heart/Heart";
import { useNavigate, useLocation } from "react-router";

const Date = () => {
  const location = useLocation();
  let selectedDate = "";
  let selectedTime = "";
  if (location.state && location.state.selectedDate && location.state.selectedTime) {
    selectedDate = location.state.selectedDate;
    selectedTime = location.state.selectedTime;
  } else {
    const dateTime = JSON.parse(localStorage.getItem("dateTime") || "{}");
    selectedDate = dateTime.date || "";
    selectedTime = dateTime.time || "";
  }
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const [happiness, setHappiness] = useState(50);
  const navigate = useNavigate();

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(
        selectedCards.filter((cardIndex) => cardIndex !== index)
      );
    } else {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const getTitle = () => {
    switch (selectedCategory) {
      case "food":
        return "What do you want to eat ?";
      case "time":
        return "When are you free ?";
      case "rate":
        return "Rate your happiness level";
      default:
    }
  };

  const showAlertWithChoices = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Thiếu thông tin ngày hoặc giờ!");
      return;
    }
    const chosenFoods = selectedCards.map((index: number) => foodData[index].title).join(", ");
    const dateTime = `${selectedDate} ${selectedTime}`;
    const API_URL = import.meta.env.VITE_API_URL; //|| "http://localhost:5000";
    try {
      const response = await fetch(
        `${API_URL}/notify-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: dateTime, food: chosenFoods, happiness }),
        });
      if (response.ok) {
        alert("Notification sent to mail!");
      } else {
        alert("Error sending message to mail!.");
      }
    } catch (error) {
      alert("Have error when sent notification.");
    }
  };
  
  const nextQuestion = () => {
    if (selectedCategory === "time") {
      if (!selectedDate || !selectedTime) {
        alert("Bạn phải chọn ngày và giờ!");
        return;
      }
      setSelectedCategory("food");
      return;
    }
    if (selectedCategory === "food") {
      if (selectedCards.length === 0) {
        alert("Bạn phải chọn ít nhất một món ăn!");
        return;
      }
      setSelectedCategory("rate");
      return;
    }
    if (selectedCategory === "rate") {
      showAlertWithChoices();
      navigate("/thankyou");
    }
  };
  
  const foodData = [
    {
      title: "Pancake",
      image: food1,
    },
    {
      title: "Manwah",
      image: food2,
    },
    {
      title: "BBQ",
      image: food3,
    },
    {
      title: "Panda",
      image: food4,
    },
    {
      title: "Snail",
      image: food5,
    },
    {
      title: "Pizza",
      image: food6,
    },
    {
      title: "Dookki",
      image: dokki,
    },
    {
      title: "Chicken",
      image: Chicken,
    },
  ];


  return (
    <Layout>
      <h1 style={{ color: pink }}>{getTitle()}</h1>
      <main className="d-flex flex-wrap justify-content-center mt-3">
        {selectedCategory === "food" &&
          foodData.map((card, index) => (
            <div key={index} className="m-2">
              <CardComponent
                title={card.title}
                image={card.image}
                isSelected={selectedCards.includes(index)}
                onClick={() => handleCardClick(index)}
              />
            </div>
          ))}
        {selectedCategory === "rate" && (
          <>
            <div className="d-flex flex-column justify-content-center">
              <img
                className="m-auto"
                src={img1}
                alt="Image 1"
                style={{
                  width: "300px",
                  marginBottom: "20px",
                  borderRadius: "15px",
                }}
              />
              <h1 style={{ color: pink }} className="py-3">
              Rate your happiness level 
              </h1>
            </div>
            <HeartSlider value={happiness} onChange={setHappiness} />
          </>
        )}
      </main>
      <HeartButton
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "0 auto",
          marginTop: "2rem",
        }}
        text="Continue ⊂(・ヮ・⊂)"
        onClick={nextQuestion}
      />
    </Layout>
  );
};

export default Date;
