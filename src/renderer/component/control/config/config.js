import { ipcRenderer } from 'electron'
import React, {Component} from 'react'
import connect from 'react-redux/es/connect/connect';
import {createSelector} from 'reselect';
import { Button, Typography, Input, Tooltip, CircularProgress, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import FolderOpenRoundedIcon from '@material-ui/icons/FolderOpenRounded'
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
import './config.scss'
import {updateEnv} from '../../../actions/envAction';

const styles = theme => ({
  button: {
    flex: 'none'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  input: {
    width: '100%'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: '#334955',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -20,
  }
});

const searchingEnv = {
  node: { version: '', path: '' },
  java: { version: '', path: '' },
  python: { version: '', path: '' },
  adb: { version: '', path: '' },
  sdk: { version: '', path: '' },
  appium: { version: '', path: '' }
}

@withStyles(styles)
class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.inputChange = this.inputChange.bind(this)
  }

  componentDidMount() {
    ipcRenderer.on('config_check_env_result', (event, args) => {
      this.props.onUpdateEnv(args.env)
      this.setState({ loading: false })
    })
    ipcRenderer.on('selected-directory', (event, path) => {
      this.updateAppiumPath(path[0])
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('config_check_env_result')
    ipcRenderer.removeAllListeners('selected-directory')
  }

  updateAppiumPath(path) {
    ipcRenderer.send('store-appium', { version: '', path: path})
    this.props.onUpdateEnv({
      node: {
        version: this.props.env.node.version,
        path: this.props.env.node.path
      },
      java: {
        version: this.props.env.java.version,
        path: this.props.env.java.path
      },
      python: {
        version: this.props.env.python.version,
        path: this.props.env.python.path
      },
      adb: {
        version: this.props.env.adb.version,
        path: this.props.env.adb.path
      },
      sdk: {
        version: this.props.env.sdk.version,
        path: this.props.env.sdk.path
      },
      appium: {
        version: '',
        path: path
      }
    })
  }

  openFileDialog() {
    ipcRenderer.send('open-file-dialog')
  }

  handleButtonClick() {
    this.props.onUpdateEnv(searchingEnv)
    ipcRenderer.send('config_check_env')
    if (!this.state.loading) {
      this.setState({ loading: true }
      );
    }
  };

  inputChange(event) {
    this.updateAppiumPath(event.target.value.trim())
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="config-wrap">
        <div className="config-check">
          <div className="config-check-title">
            <div className={classes.wrapper}>
              <Button
                color="primary"
                disabled={this.state.loading}
                onClick={this.handleButtonClick}
              >
                环境检测
              </Button>
              {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            <Tooltip title="点击左侧‘环境检查’以重新检查" placement="right">
              <HelpOutlineRoundedIcon className="config-check-title-icon"/>
            </Tooltip>
          </div>
          <div className="config-check-statistics">
            <div className="config-check-statistics-item active">
              <CheckCircleOutlineRoundedIcon />
              <p className="check-statistics-item-num">{
                Object.values(this.props.env)
                  .map(item => item.path)
                  .filter(value => value !== '').length
              }</p>
              <p className="check-statistics-item-text">已检出</p>
            </div>
            <div className="config-check-statistics-item">
              <ErrorOutlineRoundedIcon />
              <p className="check-statistics-item-num">{Object.values(this.props.env).map(item => item.path).filter(value => value === '').length}</p>
              <p className="check-statistics-item-text">未检出</p>
            </div>
          </div>
          <div className="config-check-item">
            <div className="config-check-item-svg">
              <svg t="1535075765432" className="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="1965"
                   xmlnsXlink="http://www.w3.org/1999/xlink"
                   width="32" height="32">
                <path d="M379 510.8c-26.6 12.4-70.9 14.7-90.3 41.3 19.6 14.7 48.3 14.2 74.8 15.5 108.9 4.9 245.1-4.4 338-20.6 3.1 6.7-12.9 18.3-23.2 25.8-58.6 42.8-240.7 54.9-366.3 46.4-42.1-2.8-138.3-13.9-139.3-51.6-1.3-45.7 116.6-50.6 165.1-54.2 9.4-0.7 27.3-4.6 41.2-2.6z m-54.2 116.1c12.1 1.5-8.5 8.8-5.2 18C364 688.8 502 676.4 569.8 663c14.2-2.9 28.4-11.4 38.7-10.3 25.8 2.3 42.3 32.3 64.5 36.1-78.4 35.4-229.9 52.1-340.6 30.9-28.6-5.4-78.4-20.9-80-43.9-2.1-31.1 49.5-44.3 72.4-48.9z m33.6 105.8c8 2.6-2.8 7-2.6 10.3 23.5 40.8 139.6 26.3 198.7 12.9 11.9-2.8 23.7-11.1 33.5-10.3 29.9 2 41.3 33.3 67.1 38.7-82.3 50.3-281.7 70.7-363.8 7.7-3.9-45.9 33-51 67.1-59.3z m-74.8 77.4c-24.5 6.2-88-2.6-90.3 30.9-0.8 12.9 21.7 28.1 36.1 33.5 84.1 31.7 253.1 36.6 392.1 20.6 64.5-7.5 185.8-29.2 170.3-95.5 19.4 2.3 36.6 14.7 38.7 33.5 7.7 71.2-155.8 101.1-221.9 108.4-143.7 15.7-323.3 12.6-433.4-25.8-35.9-12.4-79.2-35.4-77.4-69.7 3.1-57.6 142.4-73.6 185.8-35.9zM502.9 1024c-96.7-10.6-189.9-24.8-268.3-59.3 205.1 49.3 504.1 45.7 647.6-59.3 7.7-5.7 15-16.8 25.8-15.5-36.2 108.3-175 115.8-294.2 134.1H502.9z m219.3-487.3c53.2-45.4 143.2-27.6 147 49 4.4 89.8-93.9 140.1-165.1 144.5 33-31.5 120.2-82 103.2-154.8-7-29.4-43.6-47.2-85.1-38.7z" fill="#0277BA" p-id="1966"></path>
                <path d="M569.9 0c18.1 17 30.9 48.8 30.9 82.6 0 99.8-105.8 157.6-157.4 224.5-11.4 15-26 37.9-25.8 61.9 0.5 54.4 56.8 115.3 77.4 160-36.1-23.7-80-55.5-110.9-92.9-30.9-37.1-61.9-97.5-33.5-149.6 42.6-78.4 169.3-125.1 214.1-209 10.9-20.4 19.4-51.6 5.2-77.5z" fill="#DE4E38" p-id="1967"></path>
                <path d="M737.6 175.5c-29.7 20.9-58.6 38.7-90.3 64.5-24 19.6-67.3 46.4-69.7 82.6-3.6 54.9 81 105.8 36.1 175.4-17 26.6-45.9 37.9-82.6 54.2-4.4-8 9.5-14.7 15.5-23.2 56.3-81.5-58.6-108.6-43.9-209 14.3-97 128.6-130.9 234.9-144.5z" fill="#DE4E38" p-id="1968"></path>
              </svg>
            </div>
            <p className="config-check-item-name">Java</p>
            <p className="config-check-item-version">{this.props.env.java.version}</p>
            <p className="config-check-item-path">{this.props.env.java.path}</p>
          </div>
          <div className="config-check-item">
            <div className="config-check-item-svg">
              <svg t="1535075833845" className="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="3608" xmlnsXlink="http://www.w3.org/1999/xlink" width="32"
                   height="32">
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M512 1016c-13.4 0-27-3.6-38.8-10.4l-123.4-73c-18.4-10.4-9.4-14-3.4-16 24.6-8.6 29.6-10.4 55.8-25.4 2.8-1.6 6.4-1 9.2 0.8l94.8 56.2c3.4 2 8.2 2 11.4 0l369.4-213.2c3.4-2 5.6-6 5.6-10V298.6c0-4.2-2.2-8-5.8-10.2L517.6 75.4c-3.4-2-8-2-11.4 0L137.2 288.6c-3.6 2-5.8 6-5.8 10.2v426.2c0 4 2.2 8 5.8 9.8l101.2 58.4c55 27.4 88.6-4.8 88.6-37.4V335c0-6 4.8-10.6 10.8-10.6h46.8c5.8 0 10.8 4.6 10.8 10.6V756c0 73.2-40 115.2-109.4 115.2-21.4 0-38.2 0-85-23.2l-96.8-55.8C80.2 778.4 65.4 752.6 65.4 724.8V298.6c0-27.6 14.8-53.6 38.8-67.4L473.2 18c23.4-13.2 54.4-13.2 77.6 0l369.4 213.4c24 13.8 38.8 39.6 38.8 67.4v426.2c0 27.6-14.8 53.4-38.8 67.4L550.8 1005.6c-11.8 6.8-25.2 10.4-38.8 10.4z m298.2-420.2c0-79.8-54-101-167.4-116-114.8-15.2-126.4-23-126.4-49.8 0-22.2 9.8-51.8 94.8-51.8 75.8 0 103.8 16.4 115.4 67.6 1 4.8 5.4 8.4 10.4 8.4h48c3 0 5.8-1.2 7.8-3.4s3-5.2 2.8-8.2c-7.4-88.2-66-129.2-184.4-129.2-105.4 0-168.2 44.4-168.2 119 0 80.8 62.6 103.2 163.6 113.2 121 11.8 130.4 29.6 130.4 53.4 0 41.2-33.2 58.8-111 58.8-97.8 0-119.2-24.6-126.4-73.2-0.8-5.2-5.2-9-10.6-9h-47.8c-6 0-10.6 4.8-10.6 10.6 0 62.2 33.8 136.4 195.6 136.4 116.8-0.2 184-46.4 184-126.8z"
                  p-id="3609" fill="#70a760"></path>
              </svg>
            </div>
            <p className="config-check-item-name">Node</p>
            <p className="config-check-item-version">{this.props.env.node.version}</p>
            <p className="config-check-item-path">{this.props.env.node.path}</p>
          </div>
          <div className="config-check-item">
            <div className="config-check-item-svg">
              <svg t="1535075886269" className="icon" viewBox="0 0 1029 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="4352" xmlnsXlink="http://www.w3.org/1999/xlink"
                   width="32.15625" height="32">
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M610.304 7.68l38.4 8.704 31.232 11.264 25.088 12.8 19.456 13.824 14.336 14.336 10.752 14.336 6.656 14.336 4.096 12.8 1.536 11.264 1.024 8.704-0.512 5.632v227.84l-2.048 26.624-5.632 23.552-9.216 19.456-11.264 16.384-12.8 13.312-14.336 10.752-14.848 8.192-14.848 6.144-14.336 4.096-12.8 3.072-11.264 1.536-9.216 1.024H376.832l-29.696 2.048-25.088 6.144-21.504 9.216-17.408 11.776-13.824 13.824-11.264 14.848-8.704 15.36-6.144 15.872-4.096 14.848-3.072 13.824-1.536 11.264-1.024 9.216v130.56h-95.744l-9.216-1.024-11.776-3.072-13.824-5.12-14.848-7.68-15.36-11.264-15.36-15.36-14.848-19.456L28.672 678.4l-11.776-31.232-8.704-37.376L2.048 563.2 0 510.464l2.56-52.224 6.656-44.544 10.24-36.864 13.824-30.208 15.36-24.576 16.896-18.944 17.92-13.824 17.92-10.24 16.896-6.656 15.36-4.096 13.824-2.048 10.24-0.512h6.656l2.56 0.512h348.16v-35.328H266.24l-0.512-117.248-1.024-15.872 2.048-14.336 4.608-13.312 7.168-11.776 10.752-11.264 13.312-9.728 16.384-8.704 18.944-7.68 21.504-6.144L384 9.728l27.648-4.608 30.208-2.56 32.768-1.536L510.464 0l54.272 2.048 45.568 5.632zM342.016 92.16l-9.728 14.336-3.584 17.408 3.584 17.408 9.728 14.336 14.336 9.216 17.408 4.096 17.408-4.096 14.336-9.216 9.728-14.336 3.584-17.408-4.096-17.92-9.728-13.824-14.336-9.216-17.408-4.096-17.408 4.096-13.824 9.216z"
                  fill="#0075AA" p-id="4353"></path>
                <path
                  d="M900.096 260.608l11.776 2.56 13.824 5.12 14.848 7.68 15.36 11.264 15.36 14.848 14.848 19.968 13.824 25.088 11.776 31.232 9.216 37.376 6.144 44.544 2.048 52.224-2.56 52.224-6.656 44.544-10.24 36.864-13.824 30.208-15.36 24.576-16.896 19.456-17.92 14.336-17.92 10.24-16.896 6.656-15.36 4.096-13.824 2.048-10.24 1.024-6.656-0.512h-350.72v34.816H762.88l0.512 117.76 1.024 15.36-2.048 14.336-4.608 13.312-7.168 12.288-10.752 10.752-13.312 10.24-16.384 8.704-18.944 7.168-21.504 6.144-24.576 5.632-27.136 4.096-30.208 3.072-32.768 1.536-35.84 0.512-54.272-1.536-45.568-6.144-38.4-8.704-31.232-10.752-25.088-12.8-19.456-14.336-14.336-14.336-10.752-14.336-6.656-14.336-4.096-12.8-1.536-10.752-1.024-8.704 0.512-5.632v-227.84l2.048-27.136 5.632-23.04 9.216-19.456 11.264-16.384 12.8-13.824 14.336-10.24 14.848-8.704 14.848-6.144 13.824-4.096 12.8-2.56 11.264-1.536 9.216-1.024 5.632-0.512h249.344l29.696-2.048 25.088-6.144 21.504-8.704 17.408-11.776 14.336-13.824 11.264-14.848 8.704-15.36 6.144-15.36 4.096-14.848 3.072-13.824 1.536-11.776 1.024-9.216V259.072h89.088l6.144 0.512 6.656 1.024zM624.128 868.864L614.4 883.2l-3.584 17.408 3.584 17.408 9.728 14.336 14.336 9.728 17.408 3.584 17.408-3.584 14.336-9.728 9.728-14.336 3.584-17.408-3.584-17.408-9.728-14.336-14.336-9.728-17.408-3.584-17.408 3.584-14.336 9.728z"
                  fill="#FFD400" p-id="4354"></path>
              </svg>
            </div>
            <p className="config-check-item-name">Python</p>
            <p className="config-check-item-version">{this.props.env.python.version}</p>
            <p className="config-check-item-path">{this.props.env.python.path}</p>
          </div>
          <div className="config-check-item">
            <div className="config-check-item-svg">
              <svg t="1535075985453" className="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="5028" xmlnsXlink="http://www.w3.org/1999/xlink" width="32"
                   height="32">
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M186.181818 698.181818c0 180.130909 145.687273 325.818182 325.818182 325.818182s325.818182-145.687273 325.818182-325.818182v-186.181818H186.181818v186.181818zM703.767273 156.858182l97.745454-97.745455-38.167272-38.632727-107.054546 107.52C612.538182 106.123636 564.130909 93.090909 512 93.090909s-100.538182 13.032727-143.825455 34.909091L260.654545 20.48l-38.167272 38.632727 97.745454 97.745455C239.243636 215.970909 186.181818 310.923636 186.181818 418.909091v46.545454h651.636364V418.909091c0-107.985455-53.061818-202.938182-134.050909-262.050909zM372.363636 372.363636c-25.6 0-46.545455-20.945455-46.545454-46.545454s20.945455-46.545455 46.545454-46.545455 46.545455 20.945455 46.545455 46.545455-20.945455 46.545455-46.545455 46.545454z m279.272728 0c-25.6 0-46.545455-20.945455-46.545455-46.545454s20.945455-46.545455 46.545455-46.545455 46.545455 20.945455 46.545454 46.545455-20.945455 46.545455-46.545454 46.545454z"
                  p-id="5029" fill="#78c257"></path>
              </svg>
            </div>
            <p className="config-check-item-name">ADB</p>
            <p className="config-check-item-version">{this.props.env.adb.version}</p>
            <p className="config-check-item-path">{this.props.env.adb.path}</p>
          </div>
          <div className="config-check-item">
            <div className="config-check-item-svg">
              <svg t="1535076059175" className="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="5761" xmlnsXlink="http://www.w3.org/1999/xlink" width="32"
                   height="32">
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M110.4896 355.7376c-6.51264 13.06624-1.1264 28.91776 12.0832 35.36896l377.56928 184.7296 11.85792 5.79584 11.79648-5.79584 377.58976-184.7296c13.23008-6.4512 18.67776-22.30272 12.14464-35.36896-6.59456-13.06624-22.6304-18.39104-35.81952-11.93984l-365.69088 178.91328L146.24768 343.81824C133.03808 337.34656 117.02272 342.67136 110.4896 355.7376L110.4896 355.7376z"
                  p-id="5762"></path>
                <path
                  d="M122.5728 549.43744l377.56928 184.70912 11.85792 5.79584 11.79648-5.79584 377.58976-184.70912c13.23008-6.47168 18.67776-22.28224 12.14464-35.36896-6.59456-13.02528-22.6304-18.39104-35.81952-11.93984l-365.69088 178.93376L146.26816 502.12864c-13.23008-6.43072-29.22496-1.08544-35.77856 11.93984C103.97696 527.1552 109.3632 542.96576 122.5728 549.43744L122.5728 549.43744z"
                  p-id="5763"></path>
                <path
                  d="M476.50816 405.9136c20.29568 9.9328 50.4832 10.01472 70.90176 0l330.32192-161.5872c32.54272-15.89248 32.93184-54.31296 0-70.41024l-330.32192-161.5872c-20.2752-9.9328-50.4832-10.0352-70.90176 0L146.20672 173.93664c-32.50176 15.91296-32.8704 54.33344 0 70.41024L476.50816 405.9136 476.50816 405.9136zM500.18304 59.63776c5.4272-2.6624 18.14528-2.64192 23.53152 0l305.60256 149.504-305.60256 149.48352c-5.44768 2.6624-18.14528 2.64192-23.53152 0L194.60096 209.14176 500.18304 59.63776 500.18304 59.63776z"
                  p-id="5764"></path>
                <path
                  d="M203.79648 956.14976c18.8416 15.60576 40.2432 23.42912 64.22528 23.42912 13.59872 0 23.81824-2.3552 30.67904-7.04512 6.81984-4.68992 10.26048-10.71104 10.26048-18.06336 0-6.3488-2.70336-12.32896-8.15104-17.98144-5.4272-5.61152-19.7632-13.27104-43.04896-22.95808-36.57728-15.50336-54.84544-38.05184-54.84544-67.66592 0-21.77024 8.27392-38.68672 24.86272-50.70848 16.56832-12.06272 38.5024-18.08384 65.80224-18.08384 22.85568 0 42.04544 2.9696 57.56928 8.92928l0 46.83776c-15.70816-10.67008-34.0992-15.99488-55.13216-15.99488-12.288 0-22.1184 2.23232-29.45024 6.71744-7.3728 4.48512-11.03872 10.48576-11.03872 18.04288 0 6.06208 2.53952 11.61216 7.55712 16.6912 5.03808 5.09952 17.46944 11.96032 37.31456 20.64384 23.28576 9.95328 39.26016 20.50048 47.96416 31.55968 8.72448 11.07968 13.06624 24.28928 13.06624 39.60832 0 22.44608-7.94624 39.60832-23.8592 51.36384-15.93344 11.776-38.52288 17.67424-67.85024 17.67424-26.78784 0-48.7424-4.32128-65.88416-13.0048L203.83744 956.14976z"
                  p-id="5765"></path>
                <path
                  d="M400.67072 1015.05024 400.67072 781.04576l80.83456 0c83.10784 0 124.6208 37.9904 124.6208 114.03264 0 36.18816-11.61216 65.20832-34.89792 87.12192-23.28576 21.87264-53.28896 32.84992-90.03008 32.84992L400.67072 1015.05024zM450.51904 821.82144l0 152.43264 27.19744 0c23.67488 0 42.25024-7.0656 55.76704-21.11488 13.49632-14.11072 20.25472-33.21856 20.25472-57.30304 0-23.26528-7.08608-41.43104-21.17632-54.4768-14.09024-13.02528-32.41984-19.53792-54.9888-19.53792L450.51904 821.82144z"
                  p-id="5766"></path>
                <path
                  d="M836.42368 1015.05024l-63.16032 0-70.8608-102.27712c-1.80224-2.60096-3.85024-6.69696-6.22592-12.22656l-0.73728 0 0 114.50368-49.84832 0L645.59104 781.04576l49.84832 0 0 110.55104 0.73728 0c2.2528-4.8128 4.46464-8.99072 6.656-12.51328l67.11296-98.03776 59.51488 0-83.70176 111.63648L836.42368 1015.05024z"
                  p-id="5767"></path>
              </svg>
            </div>
            <p className="config-check-item-name">SDK</p>
            <p className="config-check-item-version">{this.props.env.sdk.version}</p>
            <p className="config-check-item-path">{this.props.env.sdk.path}</p>
          </div>
          <Typography variant="body2" gutterBottom color='primary' className="config-appium-title">Appium目录</Typography>
          <div className="config-appium-content">
            <div className="config-appium-content-icon">
              <svg t="1535093301401" className="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" p-id="5923" xmlnsXlink="http://www.w3.org/1999/xlink" width="32"
                   height="32">
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M877.308 600.328c-50.892 193.51-212.659 230.91-212.659 230.91s29.931-27.5 47.252-70.046 20.458-80.931-13.184-166S517.443 408.5 517.443 408.5c26.239-79.377 82.421-145.793 165.407-160.862 42.833-7.778 68.6-4.634 91.884 11.926-6.803-4.839 161.886 115.23 102.574 340.764z m-237.97-381.061c-45.452 9.354-79.542 28.056-132.569 102.872s-56.816 252.5-56.816 252.5c-81.439 22.445-168.555 13.094-227.265-46.759-30.3-30.892-41.938-53.811-40.894-82.132-0.305 8.275 7.344-196.944 230.28-273.241 191.28-65.463 312.487 46.759 312.487 46.759s-39.77-9.351-85.223 0.001z m-274.13 405.87c91.661 12.064 253.133-66.389 253.133-66.389C676 619.823 707.682 700.512 680.9 779.533c-13.826 40.787-29.075 61.537-55.014 73.655 7.58-3.54-180.423 84.2-351.607-76.162C127.4 639.437 172.5 481.517 172.5 481.517s9.9 39.174 39.221 74.724 61.827 56.832 153.487 68.896z"
                  p-id="5924" fill="#662d91"></path>
              </svg>
            </div>
            <div className="config-appium-content-edit">
              <Input className={classes.input} value={this.props.env.appium.path} onChange={this.inputChange}/>
            </div>
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.openFileDialog}>
              <FolderOpenRoundedIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
              打开文件
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const envSelector = createSelector(
  state => state.env,
  env => env
)

const mapStateToProps = createSelector(
  envSelector,
  env => ({
    env
  })
)

const mapActionToProps = {
  onUpdateEnv: updateEnv
}

export default connect(mapStateToProps, mapActionToProps)(Config);