import { Component } from "react";
import "./FilterSidebar.sass";
import { useHistory } from "react-router-dom";

import FilterBlock from "./FilterBlock";
import FilterDates from "./FilterDates";

import FilterSecondarySidebar from "./FilterSecondarySidebar";
import arrowIcon from "../assets/arrow.svg";
import resetIcon from "../assets/reset-icon.svg";

const filtersList = [
  {
    key: "pandemics",
    label: "Pandemics",
  },
  {
    key: "themes",
    label: "Themes",
  },
  {
    key: "tags",
    label: "Tags",
  },
  {
    key: "resource_type",
    label: "Types",
  },
  {
    key: "languages",
    label: "Languages",
  },
  {
    key: "countries",
    label: "Countries",
  },
  {
    key: "locations",
    label: "Locations",
  },
  {
    key: "dates",
    label: "Dates",
  },
];

export default class ResourceCard extends Component {
  state = {
    showSideMenu: false,
    currentFilterPanel: null,
  };

  setShowSideMenu(show) {
    this.setState({
      showSideMenu: show,
    });
  }

  setFilterPanel(value) {
    this.setState({
      currentFilterPanel: value,
    });
    value && this.setShowSideMenu(true);
  }

  currentFilterContent() {
    switch (this.state.currentFilterPanel) {
      case "pandemics":
        return (
          <FilterBlock
            blockTitle="Pandemics"
            filterName="Pandemic"
            labelBy="Name"
            filterItems={this.props.filters.pandemics}
          ></FilterBlock>
        );
      case "themes":
        return (
          <FilterBlock
            blockTitle="Themes"
            filterName="Themes"
            labelBy="Theme"
            filterItems={this.props.filters.themes}
          ></FilterBlock>
        );
      case "resource_type":
        return (
          <FilterBlock
            blockTitle="Resource Type"
            filterName="Type"
            labelBy="Type"
            filterItems={this.props.filters.types}
          ></FilterBlock>
        );
      case "tags":
        return (
          <FilterBlock
            blockTitle="Tags"
            filterName="Tags_id"
            labelBy="Tag"
            valueBy="ID"
            filterItems={this.props.filters.tags}
          ></FilterBlock>
        );
      case "languages":
        return (
          <FilterBlock
            blockTitle="Languages"
            filterName="Languages_id"
            labelBy="Language"
            valueBy="ID"
            filterItems={this.props.filters.languages}
          ></FilterBlock>
        );
      case "countries":
        return (
          <FilterBlock
            blockTitle="Countries"
            filterName="Country"
            labelBy="Country"
            filterItems={this.props.filters.countries}
          ></FilterBlock>
        );
      case "locations":
        return (
          <FilterBlock
            blockTitle="Locations"
            filterName="Location"
            labelBy="City"
            filterItems={this.props.filters.cities}
          ></FilterBlock>
        );
      case "dates":
        return <FilterDates></FilterDates>;
      default:
        return <div></div>;
    }
  }

  render() {
    const { open, toggleOpen } = this.props;
    return (
      <div className={`sidebar-container ${open ? "open" : ""}`}>
        <div className="primary-sidebar">
          <div className="sidebar-title d-flex justify-content-between align-items-center">
            <span>Filters</span>
            <span
              className="arrow-icon reverse d-block d-md-none"
              style={{ backgroundImage: `url(${arrowIcon})` }}
              onClick={toggleOpen}
            ></span>
          </div>
          {filtersList.map((t) => (
            <div
              className={`filter-type ${
                this.state.currentFilterPanel === t.key ? "active" : " "
              }`}
              onClick={() => this.setFilterPanel(t.key)}
            >
              {t.label}
              <div
                className="arrow-icon"
                style={{ backgroundImage: `url(${arrowIcon})` }}
              ></div>
            </div>
          ))}
          <ResetFilter></ResetFilter>
        </div>
        <FilterSecondarySidebar
          open={this.state.showSideMenu}
          width="250"
          title={
            this.state.currentFilterPanel
              ? filtersList.find((e) => e.key === this.state.currentFilterPanel)
                  .label
              : ""
          }
          onClose={() => {
            this.setShowSideMenu(false);
            this.setFilterPanel(false);
          }}
          children={this.currentFilterContent()}
        ></FilterSecondarySidebar>
      </div>
    );
  }
}

const ResetFilter = ({ filters }) => {
  const history = useHistory();

  function handleClick() {
    history.push("/explore");
  }

  return (
    <div className="reset-filter" onClick={handleClick}>
      <div
        className="icon"
        style={{ backgroundImage: `url(${resetIcon})` }}
      ></div>
      Reset filter
    </div>
  );
};
