import { NextFunction, Response } from "express";

import { IRequest } from "../../types";

export class HomeGetController {
  public options: {
    // homeGetService: HomeGetService;
  };
  /**
   * HomeGetController constructor
   * @constructor HomeGetController
   */
  constructor(options?: { homeGetService?: any }) {
    this.options = {
      ...options,
    };
  }
  public getHomePage = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log('RENDER HOME PAGE___')
      res.render("index", {
        title: "Home Page",
        message: "",
      });
    } catch (err) {
      next(err);
    }
  };

  public getPlayPage = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.redirect("/#/play");
    } catch (err) {
      next(err);
    }
  };
}

export const homeGetController = new HomeGetController();
