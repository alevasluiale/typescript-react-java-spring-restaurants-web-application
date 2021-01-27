import React from 'react';
import {render} from '@testing-library/react';
import Meals from './../components/meals.component';

const renderMealsComponent = () => {

  const utils = render(
    <Meals
      meals={[{id:1,name:'potatos',description:'yummi',price:2}]}
      addMeal={() => jest.fn()}
      deleteMeal={() => jest.fn()}
      modifyMeal={() => jest.fn()}
      canAdd={true}
      isInOrder={false}
    ></Meals>
  )
  return {
    ...utils
  }
}
describe('Meals component',() => {
  it('has all the components',async () => {
    const {findByText,findByPlaceholderText} = renderMealsComponent();
    expect(await findByText(/potatos/)).toBeInTheDocument()
    expect(await findByText(/yummi/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Name/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Description/)).toBeInTheDocument()
    expect(await findByPlaceholderText(/Price/)).toBeInTheDocument()
  })
})