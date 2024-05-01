import React, { useEffect, useState } from "react";
import SlideForm from "./SlideForm";
import styles from "./StoryForm.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeModal } from "../../Modal/modalSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../../common/Button/Button";
import { editStorySuccess } from "../../../API/storySlice";
import Loader from "../../common/Loader/Loader";
import BASEURL from "../../../BASEURL";

const StoryForm = () => {
  const dispatch = useDispatch();

  const { story, storyLoading } = useSelector((state) => state.story);

  const initialSlides = story && story.slides ? story.slides : [{}, {}, {}];

  const { modalContent } = useSelector((state) => state.modal);
  const { user } = useSelector((state) => state.auth);
  const [slides, setSlides] = useState(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    if (!storyLoading) {
      setSlides(story.slides);
    }
  }, [storyLoading]);

  useEffect(() => {
    setCurrentSlide(currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    if (slides.length > 6) {
      alert("Please remove slides");
    }
    if (slides.length < 3) {
      alert("Please add slides");
    }
  }, [slides]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === index ? { ...slide, [name]: value } : slide
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // FORM VALIDATION STARTS HERE
      const hasErrors = slides.some((slide, index) => {
        if (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        ) {
          setError(slide, index);
        }
        return (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        );
      });

      if (hasErrors) {
        setError("Please fill out all fields");
        return;
      }

      if (slides.length < 3) {
        setError("Please add at least 3 slides");
        return;
      } else if (slides.length > 6) {
        setError("Please remove slides");
        return;
      }
      // FORM VALIDATION ENDS HERE

      await axios
        .put(`${BASEURL}/story/update/${story._id}`, {
          slides,
          addedBy: user,
        })
        .then((response) => {
          if (response.data.success) {
            toast.success("Story updated successfully", {
              position: "bottom-right",
            });
          }

          dispatch(editStorySuccess());
          dispatch(closeModal());
        });
    } catch (error) {
      toast.error("Error creating story", { position: "bottom-right" });
    }
  };

  const handleAddSlide = () => {
    if (slides.length < 6) {
      setSlides((prevSlides) => [...prevSlides, {}]);
      setCurrentSlide(slides.length);
    }
  };

  const handleRemoveSlide = (index) => {
    if (slides.length > 3) {
      setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
      index > 0 && setCurrentSlide(index - 1);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };
  const handlePrevClick = () => {
    setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : 0);
  };
  const handleNextClick = () => {
    setCurrentSlide(
      currentSlide < slides.length - 1 ? currentSlide + 1 : slides.length - 1
    );
  };

  if (storyLoading) {
    return <Loader></Loader>;
  }

  return (
    <div
      className={`${styles.story_form} ${
        isSmallScreen ? styles.story_form__small : ""
      }`}
      style={{ display: modalContent === "EDIT_STORY" ? "flex" : "none" }}
    >
      {!isSmallScreen && (
        <div className={styles.story_Add}> Add upto 6 slides</div>
      )}

      <div className={styles.storySlide__container}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={styles.slide_box}
            onClick={() => setCurrentSlide(index)}
            style={{
              border: currentSlide === index ? "2px solid #73ABFF" : "none",
            }}
          >
            Slide{index + 1}
            {slides.length > 3 && index > 2 ? (
              <svg
                onClick={() => handleRemoveSlide(currentSlide)}
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 0C5.38341 0 0 5.38341 0 12C0 18.6166 5.38341 24 12 24C18.6166 24 24 18.6166 24 12C24 5.38341 18.6166 0 12 0ZM12 1.84615C17.6178 1.84615 22.1538 6.38221 22.1538 12C22.1538 17.6178 17.6178 22.1538 12 22.1538C6.38221 22.1538 1.84615 17.6178 1.84615 12C1.84615 6.38221 6.38221 1.84615 12 1.84615ZM8.50962 7.18269L7.18269 8.50962L10.6731 12L7.18269 15.4904L8.50962 16.8173L12 13.3269L15.4904 16.8173L16.8173 15.4904L13.3269 12L16.8173 8.50962L15.4904 7.18269L12 10.6731L8.50962 7.18269Z"
                  fill="#FF0000"
                />
              </svg>
            ) : (
              <div style={{ width: "30%" }}></div>
            )}
          </div>
        ))}
        <div
          className={styles.slide_box}
          onClick={handleAddSlide}
          style={{ cursor: "pointer" }}
        >
          Add +
        </div>
      </div>

      <svg
        className={styles.story_close}
        onClick={handleClose}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0C5.38341 0 0 5.38341 0 12C0 18.6166 5.38341 24 12 24C18.6166 24 24 18.6166 24 12C24 5.38341 18.6166 0 12 0ZM12 1.84615C17.6178 1.84615 22.1538 6.38221 22.1538 12C22.1538 17.6178 17.6178 22.1538 12 22.1538C6.38221 22.1538 1.84615 17.6178 1.84615 12C1.84615 6.38221 6.38221 1.84615 12 1.84615ZM8.50962 7.18269L7.18269 8.50962L10.6731 12L7.18269 15.4904L8.50962 16.8173L12 13.3269L15.4904 16.8173L16.8173 15.4904L13.3269 12L16.8173 8.50962L15.4904 7.18269L12 10.6731L8.50962 7.18269Z"
          fill="#FF0000"
        />
      </svg>

      <div className={styles.slideForm__container}>
        {slides.map((slide, index) => (
          <>
            {index === currentSlide && (
              <SlideForm
                key={index}
                slide={slide}
                slideIndex={index}
                handleChange={(e) => handleChange(e, index)}
                handleRemoveSlide={() => handleRemoveSlide(index)}
              />
            )}
          </>
        ))}
      </div>

      <span style={{ padding: "1rem", color: "red" }}>{error}</span>
      <div className={styles.buttons}>
        <Button
          myFunction={handlePrevClick}
          color="#7eff73"
          text="Previous"
          size="small"
        ></Button>
        <Button
          myFunction={handleNextClick}
          color="#73abff"
          text="Next"
          size="small"
        ></Button>

        <Button myFunction={handleSubmit} text="Post" size="small"></Button>
      </div>
    </div>
  );
};

export default StoryForm;
